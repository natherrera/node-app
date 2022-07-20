const { router, response } = require("express");
const { ObjectId } = require("mongoose").Types;
const { Usuario, Categoria, Producto } = require("../models");

const coleccionesPermitidas = ["usuarios", "categorias", "productos", "roles"];

const buscarUsuario = async (termino = "", res) => {
  const esMongoId = ObjectId.isValid(termino); //TRUE
  if (esMongoId) {
    const usuario = await Usuario.findOne({ _id: termino });
    return res.json({
      resultados: usuario ? [usuario] : [],
    });
  }

  const regex = new RegExp(termino, "i");

  const usuarios = await Usuario.find({
    $or: [{ nombre: regex }, { correo: regex }],
    $and: [{ estado: true }],
  });

  return res.json({
    cantidad: usuarios.length,
    resultados: usuarios,
  });
};

const buscarCategorias = async (termino = "", res) => {
  const esMongoId = ObjectId.isValid(termino); //TRUE
  if (esMongoId) {
    const categoria = await Categoria.findOne({ _id: termino });
    return res.json({
      resultados: categoria ? [categoria] : [],
    });
  }

  const regex = new RegExp(termino, "i");

  const categorias = await Categoria.find({
    $or: [{ nombre: regex }],
    $and: [{ estado: true }],
  });

  return res.json({
    cantidad: categorias.length,
    resultados: [categorias],
  });
};

const buscarProductos = async (termino = "", res) => {
  const esMongoId = ObjectId.isValid(termino); //TRUE
  if (esMongoId) {
    const producto = await Producto.findOne({ _id: termino });
    return res
      .json({
        resultado: producto ? [producto] : [],
      })
      .populate("categoria", "nombre");
  }

  const regex = new RegExp(termino, "i");

  const productos = await Producto.find({
    $or: [{ nombre: regex }],
    $and: [{ estado: true }],
  }).populate("categoria", "nombre");

  return res.json({
    cantidad: productos.length,
    resultados: productos,
  });
};

const buscar = async (req, res = response) => {
  const { coleccion, termino } = req.params;

  if (!coleccionesPermitidas.includes(coleccion))
    return res.status(400).json({
      msg: `Las colecciones permitidas son ${coleccionesPermitidas}`,
    });

  switch (coleccion) {
    case "usuarios":
      buscarUsuario(termino, res);
      break;
    case "categorias":
      buscarCategorias(termino, res);
      break;
    case "productos":
      buscarProductos(termino, res);
      break;
    case "roles":
      break;

    default:
      res.status(500).json({
        msg: "Se me olvido hacer esta búsqueda",
      });
  }
};

module.exports = {
  buscar,
};
