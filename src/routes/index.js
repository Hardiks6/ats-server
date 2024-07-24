import express from 'express';
import statusCodes from '../utils/statusCodes';
import authRoutes from './authRoutes';

export default app => {
    app.use(express.urlencoded({ extended: true }))
    app.use(express.json())

    app.get('/', (req, res) => {
        res.status(statusCodes.CODE_200).send({
            message: `Welcome to ${process?.env?.PROJECT_NAME || 'ED'} API.`
        })
    });

    app.use('/api/v1/auth', authRoutes)

    app.all('*', (req, res) => {
        res.status(statusCodes.CODE_404).send({
            message: 'Route does not exist.'
        });
    });
}