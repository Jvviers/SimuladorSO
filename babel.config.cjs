module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: { node: 'current' }, // que compile para la versión de Node que usas
      }
    ]
  ]
};