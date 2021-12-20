// JavaScript source code
import { Matrix, Vector, Subspace, Polynomial, Complex } from "./linalg/linalg.js"

class job {
	constructor( job_name, job_output_vector, job_upkeep_vector, pop_upkeep_vector, symbol_url) {
		this.job_name = job_name;
		this.job_output_vector = job_output_vector;
		this.job_upkeep_vector = job_upkeep_vector;
		this.pop_upkeep_vector = pop_upkeep_vector;
		this.job_sybmol_url = symbol_url;


		this.job_vector = [] 
		for(var i = 0; i < job_output_vector.length; i++) {
				this.job_vector.push(job_output_vector[i] - job_upkeep_vector[i] - pop_upkeep_vector[i]);
			}
	}
}

function transpose(matrix) {
  return matrix[0].map((col, i) => matrix.map(row => row[i]));
}

class outputs_model {
	constructor() {
		this.resource_order = ["Energy", "Minerals", "Food", "Alloys", "Consumer Goods", "Science"];
		this.resource_target = [0,0,0,0,0,0];
		this.jobs_needed = [0,0,0,0,0,0];
		this.jobs_list = [];
		console.debug("jobs model initialised");
	}

	add_default_jobs() {
		let worker_upkeep = [0,0,1,0,0.25,0];
		let specialist_upkeep = [0,0,1,0,0.5,0];
		let default_symbol_url = "https://stellaris.paradoxwikis.com/images/4/4f/Job_primitive_laborer.png";
		let Technician = new job("Technician", [6,0,0,0,0,0], [0,0,0,0,0,0], worker_upkeep, "https://stellaris.paradoxwikis.com/images/7/74/Job_technician.png");
		let Miner = new job("Miner", [0,4,0,0,0,0], [0,0,0,0,0,0], worker_upkeep, "https://stellaris.paradoxwikis.com/images/f/fc/Job_miner.png");
		let Farmer = new job("Farmer", [0,0,6,0,0,0], [0,0,0,0,0,0], worker_upkeep, "https://stellaris.paradoxwikis.com/images/a/a0/Job_farmer.png");
		let Metallurgist = new job("Metallurgist", [0,0,0,3,0,0], [0,6,0,0,0,0], specialist_upkeep, "https://stellaris.paradoxwikis.com/images/5/5b/Job_foundry.png");
		let Artisan = new job("Artisan", [0,0,0,0,6,0], [0,6,0,0,0,0], specialist_upkeep, "https://stellaris.paradoxwikis.com/images/5/53/Job_artisan.png");
		let Researcher = new job("Researcher", [0,0,0,0,0,12], [0,0,0,0,2,0], specialist_upkeep, "https://stellaris.paradoxwikis.com/images/9/94/Job_researcher.png");

		this.jobs_list = [Technician, Miner, Farmer, Metallurgist, Artisan, Researcher];
	}

	set_target( new_target) {
		this.resource_target = new_target;
	}

	attain_target () {
		let j_m = [];
		for (let job of this.jobs_list) {
			j_m.push(job.job_vector);
		}
		console.debug(j_m);
		j_m = transpose(j_m);
		
		console.debug(j_m);

		let J_Matrix = Matrix.create(...j_m);
		console.debug(J_Matrix.toString());
		let jobs_vector = J_Matrix.solve(Vector.create(...this.resource_target));
		
		for (let i in jobs_vector) {
			this.jobs_needed[i] = jobs_vector[i].toPrecision(3);
		}

	}

}

export {job, outputs_model };