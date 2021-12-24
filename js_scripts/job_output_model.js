// JavaScript source code
import { Matrix, Vector, Subspace, Polynomial, Complex } from "./linalg/linalg.js"

class job {
	constructor( job_name, job_output_vector, job_upkeep_vector, pop_upkeep_vector, symbol_url) {
		this.job_name = job_name;
		this.job_output_vector = job_output_vector;
		this.job_upkeep_vector = job_upkeep_vector;
		this.pop_upkeep_vector = pop_upkeep_vector;
		this.symbol_url = symbol_url;
		this.job_vector = [] 
		for(var i = 0; i < job_output_vector.length; i++) {
				this.job_vector.push(job_output_vector[i] + job_upkeep_vector[i] + pop_upkeep_vector[i]);
			}
	}
}

class resource {
	constructor(name, symbol_url){
		this.name = name;
		this.symbol_url = symbol_url;
	}

}

class modifier {
	constructor(name, perc_boost, aspect_affected, resources_affected, jobs_affected, symbol_url) {
		this.name = name;
		this.perc_boost = perc_boost;
		this.aspect_affected = aspect_affected; //an aspect variable indicating whether this affects job outputs, job upkeep, or pop upkeep
		this.resources_affected = resources_affected; // the list of resource objects that are affected by the modifier
		this.jobs_affected = jobs_affected; // the list of jobs objects that are affected by the modifier
		this.symbol_url = symbol_url;
	}
}

function transpose(matrix) {
  return matrix[0].map((col, i) => matrix.map(row => row[i]));
}

class outputs_model {
	constructor() {
		this.resource_order = ["Energy", "Minerals", "Food", "Alloys", "Consumer Goods", "Science"];
		this.resource_target = [0,0,0,0,0,0];// vectors for calculating jobs needed from a given set of resources
		this.jobs_needed = [0,0,0,0,0,0];
		
		this.jobs_given = [0,0,0,0,0,0]; // vectors for calculating the resources out from a given set of jobs
		this.resources_out= [0,0,0,0,0,0];
		
		this.jobs_list = [];
		this.resources_list = [];
		this.modifier_list = [];

		this.add_default_jobs();
		this.add_default_resources();
		this.add_default_modifiers();
		console.debug("jobs model initialised");
	}

	add_default_jobs() {
		let worker_upkeep = [0,0,-1,0,-0.25,0];
		let specialist_upkeep = [0,0,-1,0,-0.5,0];
		let default_symbol_url = "https://stellaris.paradoxwikis.com/images/4/4f/Job_primitive_laborer.png";
		let Technician = new job("Technician", [6,0,0,0,0,0], [-0.5,0,0,0,0,0], [...worker_upkeep], "https://stellaris.paradoxwikis.com/images/7/74/Job_technician.png");
		let Miner = new job("Miner", [0,4,0,0,0,0], [-0.5,0,0,0,0,0], [...worker_upkeep], "https://stellaris.paradoxwikis.com/images/f/fc/Job_miner.png");
		let Farmer = new job("Farmer", [0,0,6,0,0,0], [-0.5,0,0,0,0,0], [...worker_upkeep], "https://stellaris.paradoxwikis.com/images/a/a0/Job_farmer.png");
		let Metallurgist = new job("Metallurgist", [0,0,0,3,0,0], [-1,-6,0,0,0,0], [...specialist_upkeep], "https://stellaris.paradoxwikis.com/images/5/5b/Job_foundry.png");
		let Artisan = new job("Artisan", [0,0,0,0,6,0], [-1,-6,0,0,0,0], [...specialist_upkeep], "https://stellaris.paradoxwikis.com/images/5/53/Job_artisan.png");
		let Researcher = new job("Researcher", [0,0,0,0,0,12], [-1,0,0,0,-2,0], [...specialist_upkeep], "https://stellaris.paradoxwikis.com/images/9/94/Job_researcher.png");

		this.jobs_list = [Technician, Miner, Farmer, Metallurgist, Artisan, Researcher];
	}
	
	add_default_resources() {
		let Energy_url = "https://stellaris.paradoxwikis.com/images/a/a9/Energy.png";
		let Min_url = "https://stellaris.paradoxwikis.com/images/1/10/Minerals.png";
		let Food_url = "https://stellaris.paradoxwikis.com/images/c/c6/Food.png";
		let Alloys_url = "https://stellaris.paradoxwikis.com/images/9/9a/Alloys.png";
		let Cg_url = "https://stellaris.paradoxwikis.com/images/f/fe/Consumer_goods.png";
		let Science_url = "https://stellaris.paradoxwikis.com/images/thumb/2/20/Research.png/24px-Research.png";
		let Energy = new resource("Energy", Energy_url);
		let Minerals = new resource("Minerals", Min_url);
		let Food = new resource("Food", Food_url);
		let Alloys = new resource("Alloys", Alloys_url);
		let Consumer_goods = new resource("Consumer goods", Cg_url);
		let Science = new resource("Science", Science_url);
		this.resources_list = [Energy, Minerals, Food, Alloys, Consumer_goods, Science];

	}

	add_default_modifiers() {
		let all_resources = this.resources_list;
		let all_jobs = this.jobs_list;
		let specialist_jobs = this.jobs_list.slice(3,6);
		let worker_jobs = this.jobs_list.slice(0,3);
		let default_symbol_url = "https://stellaris.paradoxwikis.com/images/thumb/5/5c/Mod_pop_resource_output.png/24px-Mod_pop_resource_output.png";
		this.stratum_output_modifiers = [];
		this.job_specific_output_modifiers = [];
		this.job_specific_upkeep_modifiers = [];
		this.pop_upkeep_modifiers = [];
		
		//stratum specific output boosts
		let all_output_modifier = new modifier("All jobs output modifier", 0, "job_output_vector", all_resources, all_jobs, default_symbol_url);
		let specialist_output_modifier = new modifier("specialist output modifier", 0, "job_output_vector", all_resources, specialist_jobs, "https://stellaris.paradoxwikis.com/images/thumb/7/75/Pop_cat_specialist.png/24px-Pop_cat_specialist.png");
		let worker_output_modifier = new modifier("worker output modifier", 0, "job_output_vector", all_resources, worker_jobs, "https://stellaris.paradoxwikis.com/images/thumb/8/86/Pop_cat_worker.png/24px-Pop_cat_worker.png");
		this.stratum_output_modifiers = [all_output_modifier, specialist_output_modifier, worker_output_modifier];
		//job specific output boosts
		let technician_energy_output_modifier = new modifier("Technician Energy output modifier", 0, "job_output_vector", this.resources_list.slice(0,1), this.jobs_list.slice(0,1), "https://stellaris.paradoxwikis.com/images/thumb/c/c6/Pop_resource_energy_mult.png/24px-Pop_resource_energy_mult.png");
		let miner_min_output_modifier = new modifier("Miner Mineral output modifier", 0, "job_output_vector", this.resources_list.slice(1,2), this.jobs_list.slice(1,2), "https://stellaris.paradoxwikis.com/images/thumb/a/a1/Mod_resource_minerals_mult.png/24px-Mod_resource_minerals_mult.png");
		let farmer_food_output_modifier = new modifier("Farmer Food output modifier", 0, "job_output_vector", this.resources_list.slice(2,3), this.jobs_list.slice(2,3), "https://stellaris.paradoxwikis.com/images/thumb/d/d0/Pop_resource_food_mult.png/24px-Pop_resource_food_mult.png");
		let metallurgist_alloy_output_modifier = new modifier("Metallurgist Alloy output modifier", 0, "job_output_vector", this.resources_list.slice(3,4), this.jobs_list.slice(3,4),"https://stellaris.paradoxwikis.com/images/9/9a/Alloys.png");
		let artisan_cg_output_modifier = new modifier("artisan cg output modifier", 0, "job_output_vector", this.resources_list.slice(4,5), this.jobs_list.slice(4,5), "https://stellaris.paradoxwikis.com/images/f/fe/Consumer_goods.png");
		let researcher_science_output_modifier = new modifier("researcher science output modifier", 0, "job_output_vector", this.resources_list.slice(5,6), this.jobs_list.slice(5,6),"https://stellaris.paradoxwikis.com/images/thumb/2/20/Research.png/24px-Research.png");
		this.job_specific_output_modifiers = [technician_energy_output_modifier, miner_min_output_modifier, farmer_food_output_modifier, metallurgist_alloy_output_modifier, artisan_cg_output_modifier, researcher_science_output_modifier];
		//job upkeep reductions
		let metallurgist_min_upkeep_modifier = new modifier("Metallurgist Mineral upkeep modifier", 0, "job_upkeep_vector", this.resources_list.slice(1,2), this.jobs_list.slice(3,4), "https://stellaris.paradoxwikis.com/images/5/5b/Job_foundry.png");
		let metallurgist_food_upkeep_modifier = new modifier("Metallurgist Food upkeep modifier", 0, "job_upkeep_vector", this.resources_list.slice(2,3), this.jobs_list.slice(3,4), "https://stellaris.paradoxwikis.com/images/5/5b/Job_foundry.png");
		let artisan_min_upkeep_modifier = new modifier("Artisan Mineral upkeep modifier", 0, "job_upkeep_vector", this.resources_list.slice(1,2), this.jobs_list.slice(4,5), "https://stellaris.paradoxwikis.com/images/5/53/Job_artisan.png");
		let researcher_cg_upkeep_modifier = new modifier("Researcher Cg upkeep modifier", 0, "job_upkeep_vector", this.resources_list.slice(4,5), this.jobs_list.slice(5,6), "https://stellaris.paradoxwikis.com/images/9/94/Job_researcher.png");
		this.job_specific_upkeep_modifiers = [metallurgist_min_upkeep_modifier, metallurgist_food_upkeep_modifier, artisan_min_upkeep_modifier, researcher_cg_upkeep_modifier];
		//pop upkeep reductions
		let all_pop_upkeep_modifier = new modifier("Pop upkeep modifier", 0, "pop_upkeep_vector", all_resources, all_jobs, "https://stellaris.paradoxwikis.com/images/thumb/3/36/Mod_pop_robot_upkeep_mult.png/24px-Mod_pop_robot_upkeep_mult.png");
		let pop_food_upkeep_modifier = new modifier("Pop food upkeep modifier", 0, "pop_upkeep_vector", this.resources_list.slice(2,3), all_jobs, "https://stellaris.paradoxwikis.com/images/thumb/c/c6/Food.png/24px-Food.png");
		let pop_cg_upkeep_modifier = new modifier("Pop Cg upkeep modifier", 0, "pop_upkeep_vector", this.resources_list.slice(4,5), all_jobs, "https://stellaris.paradoxwikis.com/images/thumb/3/3f/Mod_consumer_goods_upkeep_mult.png/24px-Mod_consumer_goods_upkeep_mult.png");
		this.pop_upkeep_modifiers = [all_pop_upkeep_modifier, pop_food_upkeep_modifier, pop_cg_upkeep_modifier];
		
		this.modifier_list = this.stratum_output_modifiers.concat(this.job_specific_output_modifiers).concat(this.job_specific_upkeep_modifiers).concat(this.pop_upkeep_modifiers);
	}

	apply_modifiers() {
		this.reset_job_vectors();
		//for (let modifier of this.modifier_list) {
		for (let modifier of this.modifier_list) {
		
			for (let job of modifier.jobs_affected) {
				let resource_boolean = [];
				for (let resource of this.resources_list) {
					resource_boolean.push(modifier.resources_affected.includes(resource));
				}
				for (let i in resource_boolean) {
					if (resource_boolean[i] == true) {
						//console.debug(modifier.perc_boost);
						job.job_vector[i] += job[modifier.aspect_affected][i] * (modifier.perc_boost /100);
					}
				}

				 // take the job_vector and add on j_out_aspect * (modifier - 1)
			}
		}
	}

	reset_job_vectors() {
		for (let job of this.jobs_list) {
			job.job_vector = []; 
			for(var i = 0; i < job.job_output_vector.length; i++) {
				job.job_vector.push(job.job_output_vector[i] + job.job_upkeep_vector[i] + job.pop_upkeep_vector[i]);
			}	
		}
		
	}

	set_target( new_target) {
		this.resource_target = new_target;
	}

	attain_jobs_for_target () {
		let j_m = [];
		for (let job of this.jobs_list) {
			j_m.push(job.job_vector);
		}
		j_m = transpose(j_m);

		let J_Matrix = Matrix.create(...j_m);
		let jobs_vector = J_Matrix.solve(Vector.create(...this.resource_target));

		for (let i in jobs_vector) {
			this.jobs_needed[i] = jobs_vector[i].toFixed(1);
		}

	}

	attain_resources_from_jobs () {
		let j_m = [];
		for (let job of this.jobs_list) {
			j_m.push(job.job_vector);
		}
		j_m = transpose(j_m);

		let J_Matrix = Matrix.create(...j_m);
		let resource_vector = J_Matrix.apply(Vector.create(...this.jobs_given));

		for (let i in resource_vector) {
			this.resources_out[i] = resource_vector[i].toFixed(1);
		}

	}

}

export {job, resource, modifier, outputs_model };