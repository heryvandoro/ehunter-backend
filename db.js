const Sequelize = require('sequelize');
const db = {};

const BASE_URL = "http://localhost:3000";
const GOOGLE_STORAGE = "https://storage.cloud.google.com/ehunter";

db.seq = new Sequelize('db_name', 'username', 'password', {
	host: 'localhost',
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
	bio : Sequelize.STRING,
	cv : {
		type : Sequelize.STRING,
		get() {
			let cv = this.getDataValue('cv');
			if(!cv) return null;
			return GOOGLE_STORAGE+"/"+this.getDataValue('cv');
		}
	},
	cv_raw : Sequelize.STRING,
	ktp_raw : Sequelize.STRING,
	ktp : {
		type : Sequelize.STRING,
		get() {
			let ktp = this.getDataValue('ktp');
			if(!ktp) return null;
			return GOOGLE_STORAGE+"/"+ktp;
		}
	},	
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
	logo : {
		type : Sequelize.STRING,
		get() {
			return GOOGLE_STORAGE+"/"+this.getDataValue('logo');
		}
	},	
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
	description : Sequelize.STRING,
	status : Sequelize.INTEGER
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

db.HunterVacancy = db.seq.define("hunter_vacancy", {
	hunter_id : Sequelize.INTEGER,
	vacancy_id : Sequelize.INTEGER,
	result : Sequelize.STRING,
	score : Sequelize.INTEGER,
	reason : Sequelize.STRING,
	feedback : Sequelize.STRING,
}, { timestamps: false, underscored: true, freezeTableName : true });

db.Task = db.seq.define("tasks", {
	id : {
		type : Sequelize.INTEGER,
		primaryKey : true,
		autoIncrement: true
	},
	vacancy_id : Sequelize.INTEGER,
	criteria : Sequelize.STRING
}, { timestamps: false, underscored: true });

/* Relations Section */
db.Company.hasMany(db.Vacancy);
db.Vacancy.belongsTo(db.Company);
db.Vacancy.hasMany(db.Requirement);
db.Requirement.belongsTo(db.Vacancy);
db.Hunter.belongsToMany(db.Vacancy, { through: db.HunterVacancy });
db.Vacancy.belongsToMany(db.Hunter, { through: db.HunterVacancy });

module.exports = db;