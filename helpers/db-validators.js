const { Categoria, Producto } = require('../models');
const Role = require('../models/role');
const Usuario = require('../models/usuario');


const esRoleValido = async(rol = '') => {

    const existeRol = await Role.findOne({ rol });
    if ( !existeRol ) {
        throw new Error(`El rol ${ rol } no está registrado en la BD`);
    }
}

const emailExiste = async( correo = '' ) => {

    // Verificar si el correo existe
    const existeEmail = await Usuario.findOne({ correo });
    if ( existeEmail ) {
        throw new Error(`El correo: ${ correo }, ya está registrado`);
    }
}

const existeUsuarioPorId = async( id ) => {
    
    // Verificar si el id existe
    const existeUsuario = await Usuario.findOne({id});
    if ( !existeUsuario ) {
        throw new Error(`El id ${ id } no está registrado en la BD`);
    }
}

/**
 * Existe Categoria
 * @param {*} id 
 */


const existeCategoriaPorId = async( id = '' ) => {

    // Verificar si la categoria existe
    const existeCategoria = await Categoria.findOne({ _id: id });
    if ( !existeCategoria ) {
        throw new Error( `La categoria con el id: ${ id }, no está registrada`);
    }
}
const existeProductoPorId = async( id = '' ) => {

    // Verificar si el producto existe
    if(id.length === 24) {
        const existeProducto = await Producto.findOne({ _id: id });
        if ( !existeProducto ) {
            throw new Error( `El producto con el id: ${ id }, no está registrado`);
        }
    }
}



module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId
}

