# -*- coding: utf-8 -*-
import os
from flask import Flask


def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY='dev',
        DATABASE=os.path.join(app.instance_path, 'flaskr.sqlite'),
    )

    if test_config is None:
        # load the instance config, if it exits, when no testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    from . import db
    db.init_app(app)

    @app.route('/hello')
    def hello():
        return 'Hello, World!'

    # 注册auth蓝图
    from . import auth
    app.register_blueprint(auth.bp)
    # 注册 blog蓝图
    from . import blog
    app.register_blueprint(blog.bp)

    # 关联端点名称 'index' 和 /, 这样 url_for('index') 或 url_for('blog.index') 都会有效，会生成同样的 /
    app.add_url_rule('/', endpoint='index')

    return app
