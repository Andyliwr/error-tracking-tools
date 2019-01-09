# -*- coding: utf-8 -*-
import functools
from flask import (Blueprint, flash, g, redirect, render_template, request,
                   session, url_for)

from werkzeug.security import check_password_hash, generate_password_hash
from flaskr.db import get_db

bp = Blueprint('auth', __name__, url_prefix='/auth')


# 注册
@bp.route('/register', methods=('GET', 'POST'))
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        db = get_db()
        error = None

        if not username:
            error = 'Username is required.  '
        elif not password:
            error = 'Password is required.'
        elif db.execute('SELECT id from user WHERE username=  ?',
                        (username, )).fetchone() is not None:
            error = 'User {} is already registered'.format(username)

        if error is None:
            db.execute('INSERT INTO user (username, password) VALUES (?, ?)',
                       (username, generate_password_hash(password)))
            db.commit()
            # goto login page
            return redirect(url_for('auth.login'))

        flash(error)

    return render_template('auth/register.html')


# 登录
@bp.route('/login', methods=('GET', 'POST'))
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        db = get_db()
        error = None

        user = db.execute('SELECT * FROM user WHERE username = ?',
                          (username, )).fetchone()

        if (user is None):
            error = 'Incorrect username.'
        elif not check_password_hash(user['password'], password):
            error = 'Incorrect password.'

        if error is None:
            session.clear()
            session['user_id'] = user['id']
            return redirect(url_for('index'))

        flash(error)

    return render_template('auth/login.html')


# 注册一个 在视图函数之前运行的函数，不论其 URL 是什么。 load_logged_in_user 检查用户 id 是否已经储存在 session 中，并从数据库中获取用户数据，然后储存在 g.user 中
@bp.before_app_request
def load_logined_in_user():
    user_id = session.get('user_id')

    if user_id is None:
        g.user = None
    else:
        g.user = get_db().execute('SELECT * FROM user WHERE id = ?',
                                  (user_id, )).fetchone()


# 注销
@bp.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('index'))


# 装饰器返回一个新的视图，该视图包含了传递给装饰器的原视图。新的函数检查用户 是否已载入。如果已载入，那么就继续正常执行原视图，否则就重定向到登录页面。
def login_required(view):
    @functools.wraps(view)
    def wrapped_view(**kwargs):
        if g.user is None:
            return redirect(url_for('auth.login'))
        return view(**kwargs)

    return wrapped_view
