import { response } from "../../../utils/index.js";
import MenuRepositories from "../repositories/menu-repositories.js";

export const addMenu = async (req, res) => {
    const { name, price, description } = req.validated;

    const result = await MenuRepositories.addMenu(name, price, description);

    return response(res, 201, null, { addedMenus: result });
}