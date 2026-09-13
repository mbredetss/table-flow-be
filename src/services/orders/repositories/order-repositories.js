import { Pool } from "pg";

class OrderRepositories {
    constructor() {
        this.pool = Pool();
    }

    
}

export default new OrderRepositories();