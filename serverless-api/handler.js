module.exports.hello = async (event) => {
  const name = event.queryStringParameters?.name || 'Mundo';

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: `Hola ${name} desde Serverless` }),
  };
};
