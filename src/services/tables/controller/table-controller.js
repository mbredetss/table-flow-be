import { response } from "../../../utils/index.js";
import tableRepositories from "../repositories/table-repositories.js";

export const setTableCount = async (req, res) => {
    const tableCount = req.validated.tableCount;

    for (let i = 1; i <= tableCount; i++) {
        await tableRepositories.addTable(`table-${i}`);
    }

    const tables = await tableRepositories.getAllTable();

    return response(res, 200, null, { tables });
}