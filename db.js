const Sequelize = require('sequelize-hierarchy')();
const db = {};

db.seq = new Sequelize('ehunter', 'ehunter', 'ehunter_ehunter', {
	host: 'mahirkoding.com',
	dialect: 'mysql',
	operatorsAliases : Sequelize.op,
	pool: {
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000
	}
});

db.Hunter = db.seq.define("hunters", {
	id : {
		type : Sequelize.INTEGER,
		primaryKey : true,
		autoIncrement: true
	},
	name : Sequelize.STRING,
	email : Sequelize.STRING,
	password : Sequelize.STRING,
	cv : Sequelize.STRING,
	cv_raw : Sequelize.STRING
}, { timestamps: false, underscored: true });

db.Company = db.seq.define("companies", {
	id : {
		type : Sequelize.INTEGER,
		primaryKey : true,
		autoIncrement: true
	},
	name : Sequelize.STRING,
	email : Sequelize.STRING,
	password : Sequelize.STRING,
	description : Sequelize.STRING
}, { timestamps: false, underscored: true });

db.Vacancy = db.seq.define("vacancies", {
	id : {
		type : Sequelize.INTEGER,
		primaryKey : true,
		autoIncrement: true
	},
	company_id : Sequelize.INTEGER,
	position_name : Sequelize.STRING,
	salary_start : Sequelize.INTEGER,
	salary_end : Sequelize.INTEGER,
	description : Sequelize.STRING
}, { timestamps: false, underscored: true });

db.Requirement = db.seq.define("requirements", {
	id : {
		type : Sequelize.INTEGER,
		primaryKey : true,
		autoIncrement: true
	},
	vacancy_id : Sequelize.INTEGER,
	text : Sequelize.STRING
}, { timestamps: false, underscored: true });

db.Category = db.seq.define("categories", {
	id : {
		type : Sequelize.INTEGER,
		primaryKey : true,
		autoIncrement: true
	},
	name : Sequelize.STRING,
	parent_id : Sequelize.INTEGER
}, { timestamps: false, underscored: true });


/* Relations Section */
db.Vacancy.hasMany(db.Requirement);
db.Requirement.belongsTo(db.Vacancy);
db.Category.isHierarchy({
    foreignKey : "parent_id",
    throughKey : "children_id",
    through : "categories_ancestor",
    throughForeignKey : "parent_id",
    throughTable : "categories_ancestor",
    throughForeignKey : "parent_id",
    ancestorsAs : "parents",
    descendentsAs : "childrens"
});

/* Others */
db.Category.rebuildHierarchy();

module.exports = db;