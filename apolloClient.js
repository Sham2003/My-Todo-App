import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import appConfig from './appConfig';


export const createApolloClient = (authToken) => {
 return new ApolloClient({
   link: new HttpLink({
     uri: appConfig.graphql.uri,
     headers: {
       Authorization: `Bearer ${authToken}`
     }
   }),
   cache: new InMemoryCache(),
 });
};
