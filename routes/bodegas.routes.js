import {Router} from 'express';

const bodega = Router();

bodega.get('/',(req, res) => {
    res.send('a')
});


export default bodega