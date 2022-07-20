const { response, request } = require("express");
const { Categoria } = require("../models");

// obtenerCategorias - paginado - total - populate(mongose)
const obtenerCategorias = async (req = request, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };

  const [total, categorias] = await Promise.all([
    Categoria.countDocuments(query),
    Categoria
      .find(query)
      .populate("usuario", "nombre")
      .skip(Number(desde))
      .limit(Number(limite)),
  ]);

  res.status(200).json({
    total,
    categorias,
  });
};

// obtenerCategorias - populate(mongose){}
const obtenerCategoriaPorId = async (req = request, res = response) => {
  const { id } = req.params;
  const categoria = await Categoria.findOne({ _id: id }).populate(
    "usuario",
    "nombre"
  );
  res.json(categoria);
};

const crearCategoria = async (req, res = response) => {
  const nombre = req.body.nombre.toUpperCase();

  const categoriaDB = await Categoria.findOne({ nombre });

  if (categoriaDB) {
    return res.status(400).json({
      msg: `La categoria ${categoriaDB.nombre}, ya existe`,
    });
  }

  const data = {
    nombre,
    usuario: req.usuario._id,
  };

  const categoria = await new Categoria(data);

  //Guardar DB

  await categoria.save();

  res.status(201).json(categoria);
};

//actualizarCategoria  - (el otro nombre no debe existir)

const actualizarCategoria = async (req = request, res = response) => {
  const { id } = req.params;
  const { estado, usuario, ...data } = req.body;

  data.nombre = data.nombre.toUpperCase();

  const nombreExiste = await Categoria.findOne({ nombre: data.nombre });
  if (nombreExiste) {
    return res.status(400).json({
      msg: `El nombre ${nombreExiste.nombre}, ya existe`,
    });
  }

  const categoria = await Categoria.findByIdAndUpdate(id, data, {
    new: true,
  }).populate("usuario", "nombre");

  res.json(categoria);
};

//Borrar categoria por id
const borrarCategoria = async (req = request, res = response) => {
  const { id } = req.params;

  const categoria = await Categoria.findByIdAndUpdate(
    id,
    { estado: false },
    { new: true }
  ).populate("usuario", "nombre");

  res.json(categoria);
};

module.exports = {
  obtenerCategorias,
  crearCategoria,
  obtenerCategoriaPorId,
  actualizarCategoria,
  borrarCategoria,
};
