import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

const client = new ApolloClient({
  link: createHttpLink({
    uri: 'https://frysaelspbbfxlwfpinw.hasura.ap-south-1.nhost.run/v1/graphql',
    headers: {
      'x-hasura-admin-secret': '0$7uPW:NQ!7nGI!ub7Z)NDttq%DdKkl4',
    },
  }),
  cache: new InMemoryCache(),
});

import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";

if (__DEV__) {
  loadDevMessages();
  loadErrorMessages();
}

export default client;
