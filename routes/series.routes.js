const express = require('express');
const seriesRouter = express.Router();
const Serie = require('../model/Series');
const createError = require('../utils/errors/createError.js');
const uploadToCloud = require ('../utils/middlewares/cloudinary.js');
const upload = require('../utils/middlewares/files.middleware.js');


seriesRouter.get('/', async (request, response, next) => {
    try {
        const allSeries = await Serie.find();
        return response.status(200).json(allSeries);
    } catch (error) {
        next(error)
    }
});
seriesRouter.get('/paged', async (request, response, next) => {
    try {
        let page = request.query.page;
        const startPage = (page - 1) * 3;
        const endPage = page * 3;
        const allSeries = await Serie.find({}, { createdAt: 0, updatedAt: 0, __v: 0 }).sort({ year: 1 });
        if (allSeries.length === 0) {
            return next(createError('No hay series disponibles', 404))
        }
        if (!page) {
            return next(createError('No se ha indicado un número de página valido', 404))
        }
        page = parseInt(page, 10);
        const pagedSeries = allSeries.slice(0, 3);
        const maxPage = Math.ceil(allSeries.length / 3);
        if (page <= 0 || (page - 1) * 3 > allSeries.length - 1) {
            return response.status(404).json(`La página no existe, la primera página es: 1 y la ultima pagina es : ${maxPage}`);
        }
        response.status(200).json({
            movies: allSeries.slice(startPage, endPage),
            nextPage: page + 1 <= maxPage ? page + 1 : null,
            previousPage: page - 1 < 1 ? null : page - 1
        });
    } catch (error) {
        next(error)
    }
});
seriesRouter.get('/title/:title', async (request, response, next) => {
    try {
        const titleSerie = request.params.title;
        const serie = await Serie.find({ title: titleSerie });
        if (serie.length === 0) {
            return next(createError(`No hay ninguna serie con el Título: ${titleSerie}`, 404))
        }
        return response.status(200).json(serie);
    } catch (error) {
        next(error)
    }
});
seriesRouter.post('/to-cloud',  [upload.single('picture'), uploadToCloud], async (request, response, next) => {

    try {
      const newSerie = new Serie({ ...request.body, picture: request.file_url });
  
      const createdSerie = await newSerie.save();
  
      return response.status(201).json(createdSerie);
  
    } catch (err) {
  
      next(err);
  
    }
  
  });
seriesRouter.put('/:id',  async (request, response, next) => {
    try {
        const id = request.params.id;
        const modifiedSerie = new Serie({ ...request.body });
        modifiedSerie._id = id;
        const updatedSerie = await Serie.findByIdAndUpdate(
            id,
            modifiedSerie,
            { new: true }
        );
        if (!updatedSerie) {
            return next(createError(`No se encuentra la serie con el Id: ${id} para actualizarla`, 404))
        }
        return response.status(201).json(updatedSerie);
    } catch (error) {
        next(error)
    }
});
seriesRouter.delete('/:id', async (request, response, next) => {
    try {
        const id = request.params.id;
       
        const deletedSerie = await Serie.findByIdAndDelete(id);
        if (!deletedSerie) {
            return next(createError(`No se encuentra la serie con el Id: ${id} para eliminarla`, 404))
        } else {
            return response.status(200).json(`Serie eliminada con éxito`);
        }
    } catch (error) {
        next(error)
    }
});





module.exports = seriesRouter;


