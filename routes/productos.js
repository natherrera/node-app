const { Router } = require('express');
const { check } = require('express-validator');
const { obtenerProductos, crearProducto, actualizarProducto, obtenerProductoPorId, borrarProducto } = require('../controllers/productos');
const { existeProductoPorId, existeCategoriaPorId } = require('../helpers/db-validators');
const { validarJWT, esAdminRole } = require('../middlewares');

const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

/**
 * {{url}}/api/productos
 * **/

// Obtener todas los productos - publico
router.get('/', obtenerProductos)

// Obtener un producto por ID - publico
router.get('/:id', [
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos,
], obtenerProductoPorId)

// Crear categoria - privado - cualquier persona con un token valido
router.post('/', [
    validarJWT, 
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un id de Mongo válido').isMongoId(),
    check('categoria', 'La categoria es obligatoria').not().isEmpty(),
    check('categoria').custom( existeCategoriaPorId ),
    validarCampos
] , crearProducto)

// Actualizar un registro por id - privado- cualquiera con token valido
router.put('/:id', [
    validarJWT,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un id de Mongo válido').isMongoId(),
    check('categoria').custom( existeCategoriaPorId ),
    validarCampos,
], actualizarProducto)

// Borrar una categoria - privado- solo admin
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], borrarProducto)

module.exports = router;