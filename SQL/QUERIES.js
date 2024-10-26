import { gql } from "@apollo/client";


export const ADD_USER = gql`
  mutation InsertAppUsers($name: String, $number: String, $uid: String, $referrer: String, $email: String) {
    insert_app_users(objects: { name: $name, number: $number, uid: $uid, referrer: $referrer ,email: $email}) {
      affected_rows
    }
  }
`;


// Todo Screen
export const GET_TODOS = gql`
  query GetTodos($uid: String!) {
    todos(where: { uid: { _eq: $uid } }) {
      id
      task
      completed
      uid
      created_at
      updated_at
    }
  }
`;

export const INSERT_TODO = gql`
  mutation InsertTodo($task: String!, $uid: String!) {
    insert_todos_one(object: { task: $task, uid: $uid, completed: false }) {
      id
      task
      completed
    }
  }
`;

export const TOGGLE_TODO = gql`
  mutation ToggleTodoStatus($id: uuid!, $completed: Boolean!) {
    update_todos_by_pk(pk_columns: { id: $id }, _set: { completed: $completed }) {
      id
      completed
    }
  }
`;

export const DELETE_TODO = gql`
  mutation DeleteTodo($id: uuid!) {
    delete_todos_by_pk(id: $id) {
      id
    }
  }
`;
// Profile Screen
export const GET_PROFILE = gql`
  query GetUserProfile($uid: String!) {
    app_users(where: { uid: { _eq: $uid } }) {
      uid
      name
      number
      email
      referral_code
      refcount
    }
  }
`;

export const UPDATE_PROFILE = gql`
  mutation UpdateUserProfile($uid: String!, $name: String, $number: String) {
    update_app_users(
      where: { uid: { _eq: $uid } }
      _set: { name: $name, number: $number }
    ) {
      affected_rows
    }
  }
`;

// export const GET_NUMBER_OF_REFERRERS = gql`
//   query GetNumberOfReferrers($referral_code: String!) {
//     app_users_aggregate(where: { referrer: { _eq: $referral_code } }) {
//       aggregate {
//         count
//       }
//     }
//   }
// `;