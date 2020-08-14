const axios = require('axios')

const {
    GraphQLObjectType, 
    GraphQLInt, 
    GraphQLString, 
    GraphQLBoolean,
    GraphQLList,
    GraphQLSchema,
    GraphQLNonNull
} = require('graphql')



// Types
const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        role: {type: GraphQLString},
        name: {type: GraphQLString},
        email: {type: GraphQLString},
        phone_number: {type: GraphQLString},
        password: {type: GraphQLString},
        id: {type: GraphQLString}
    })
})

const ComplaintsType = new GraphQLObjectType({
    name: 'Complaint',
    fields: () => ({
        id: {type: GraphQLInt},
        product_id: {type: GraphQLString},
        user_id: {type: GraphQLString},
        text: {type: GraphQLString},
        name: {type: GraphQLString},
        status: {type: GraphQLString}
    })
})

const ProductType = new GraphQLObjectType({
    name: 'Product',
    fields: () => ({
        id: {type: GraphQLInt},
        product_category: {type: GraphQLString},
        name: {type: GraphQLString},
        price: {type: GraphQLInt},
        description: {type: GraphQLString},
        manufactured_country: {type: GraphQLString},
        feature: {type: GraphQLString}
    })
})

const OrderType = new GraphQLObjectType({
    name: 'Order',
    fields: () => ({
        id: {type: GraphQLInt},
        user_id: {type: GraphQLString},
        product_id: {type: GraphQLList},
        user_name: {type: GraphQLInt},
        date: {type: GraphQLString},
        product_price: {type: GraphQLString}
    })
})

const CategoryType = new GraphQLObjectType({
    name: 'Category',
    fields: () => ({
        id: {type: GraphQLInt},
        message: {type: GraphQLString}
    })
})

const AlertType = new GraphQLObjectType({
    name: 'Alert',
    fields: () => ({
        id: {type: GraphQLInt},
        message: {type: GraphQLString},
        type: {type: GraphQLString}
    })
})


// Query
const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        users: {
            type: new GraphQLList(UserType),
            resolve(parent, args) {
                return axios.get('http://localhost:3000/users')
                    .then(res => res.data)
            }
        },
        user: {
            type: UserType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args) {
                return axios.get('http://localhost:3000/users/' + args.id)
                    .then(res => res.data)
            }
        }
    }
})

//Mutations
const mutation = new GraphQLObjectType({
    name: "Mutations",
    fields: {
        register: {
            type: UserType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},
                email: {type: new GraphQLNonNull(GraphQLString)},
                password: {type: new GraphQLNonNull(GraphQLString)},
                role: {type: new GraphQLNonNull(GraphQLString)},
                phone_number: {type: new GraphQLNonNull(GraphQLString)},
            },
            resolve(parentValue, args){
                return axios.post('http://localhost:3000/users', {
                    name: args.name,
                    email: args.email,
                    role: args.role,
                    password: args.password,
                    phone_number: args.phone_number
                })
                .then(res => res.data)
            }
        },
        auth: {
            type: UserType,
            args: {
                password: {type: new GraphQLNonNull(GraphQLString)},
                email: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parentValue, args){
                return axios.post('http://localhost:3000/login', {
                    password: args.password,
                    email: args.email    
                })
            }
        }
    }
})





module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
})