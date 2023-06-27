// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
    production: false,
    apiURL: 'developmentApi',
    // baseUrl : 'https://skindevreplica.api.tatamotors',
    // baseUrl : 'https://skincicdqa.api.tatamotors',
      //test
  
    // baseUrl: 'https://skinprod.api.tatamotors',  //PROD
    baseUrl : 'https://skindevreplica.api.tatamotors', //SANDBOX 
    // baseUrl : 'https://skinqa-cv.api.tatamotors:8080/', //QA
    version: '0.0.3'
  };
  