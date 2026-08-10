import { response } from "../../../utils/index.js";
import MenuRepositories from "../repositories/menu-repositories.js";

export const addMenu = async (req, res) => {
    const { name, price, description } = req.validated;

    const result = await MenuRepositories.addMenu(name, price, description);

    return response(res, 201, null, { addedMenus: result });
}

export const editMenu = async (req, res) => {
    const { name, price, description } = req.validated;
    const { id } = req.params;

    const result = await MenuRepositories.editMenu(id, name, price, description);

    return response(res, 201, null, { editedMenus: result });
}

export const deleteMenu = async (req, res) => {
    const { id } = req.params;

    const result = await MenuRepositories.deleteMenu(id);

    if (result.length === 0) return response(res, 404, 'Menu not found', null);

    return response(res, 200, 'Menu berhasil dihapus', null);
}

export const getMenus = async (req, res) => {
    const result = await MenuRepositories.getMenus();

    return response(res, 200, null, { menus: result });
}