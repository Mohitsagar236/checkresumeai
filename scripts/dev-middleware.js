// Development server middleware to fix MIME types
const express = require('express');
const path = require('path');

const setupMimeTypes = (app) => {
  // Fix CSS MIME type
  app.use('*.css', (req, res, next) => {
    res.setHeader('Content-Type', 'text/css');
    next();
  });

  // Fix JavaScript MIME type
  app.use('*.js', (req, res, next) => {
    res.setHeader('Content-Type', 'application/javascript');
    next();
  });

  // Fix MJS MIME type
  app.use('*.mjs', (req, res, next) => {
    res.setHeader('Content-Type', 'application/javascript');
    next();
  });

  // Fix PDF worker files
  app.use('/pdf-worker/*', (req, res, next) => {
    if (req.path.endsWith('.mjs') || req.path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
    next();
  });
};

module.exports = { setupMimeTypes };
