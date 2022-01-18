# 初始化 Migrations 配置文件和目录
npx sequelize init:config
npx sequelize init:migrations

# 创建数据库
npx sequelize db:create

# 销毁数据库
npx sequelize db:drop

# 创建数据库表
npx sequelize migration:generate --name=init-users

# 升级数据库
npx sequelize db:migrate

# 如果有问题需要回滚，可以通过 `db:migrate:undo` 回退一个变更
npx sequelize db:migrate:undo

# 可以通过 `db:migrate:undo:all` 回退到初始状态
npx sequelize db:migrate:undo:all

# 创建种子文件，用于初始化数据库数据
npx sequelize seed:generate --name demo-user

# 执行数据插入操作
npx sequelize db:seed:all

# 撤销指定种子
npx sequelize db:seed:undo --seed 指定种子文件

# 撤销所有种子文件
npx sequelize db:seed:undo:all

# 升级指定环境数据库
npx sequelize db:migrate --env=test