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

const ComplaintType = new GraphQLObjectType({
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
        feature: {type: GraphQLString},
        image: {type: GraphQLString}
    })
})

const OrderType = new GraphQLObjectType({
    name: 'Order',
    fields: () => ({
        id: {type: GraphQLInt},
        user_id: {type: GraphQLString},
        product_id: {type: GraphQLString},
        user_name: {type: GraphQLString},
        date: {type: GraphQLString},
        product_price: {type: GraphQLString},
        status: {type: GraphQLBoolean}
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
        signup: {
            type: UserType,
            args: {
                accessToken: {type: new GraphQLNonNull(GraphQLString)},
                email: {type: new GraphQLNonNull(GraphQLString)},
                password: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args) {
                return axios.post('http://localhost:3000/signup',{email: args.email,password: args.password},{headers: {'Authorization': args.accessToken}})
                    .then(res => res.data)
            }
        },
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
        },
        products: {
            type: new GraphQLList(ProductType),
            args: {
                manufactured_country: {type: GraphQLString},
                price: {type: GraphQLInt},
                sort: {type: GraphQLString},
                page: {type: GraphQLString},
                limit: {type: GraphQLInt},
                category: {type: GraphQLString}
            },
            resolve(parent, args) {
                if(args.category){
                    return axios.get('http://localhost:3000/categoryes?message=' + args.category)
                    .then(res => {
                        axios.get('http://localhost:3000/products?categoryId=' + res.data[0].id)
                    })
                } 
                return axios.get('http://localhost:3000/products')
                    .then(res => res.data)
            }
        },
        product: {
            type: ProductType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args) {
                return axios.get('http://localhost:3000/products/' + args.id)
                    .then(res => res.data)
            }
        },
        orders: {
            type: new GraphQLList(OrderType),
            resolve(parent, args) {
                return axios.get('http://localhost:3000/orders')
                    .then(res => res.data)
            }
        },
        order: {
            type: OrderType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parent, args) {
                return axios.get('http://localhost:3000/orders/' + args.id)
                    .then(res => res.data)
            }
        },
        complaints: {
            type: new GraphQLList(ComplaintType),
            resolve(parent, args) {
                return axios.get('http://localhost:3000/complaints')
                    .then(res => res.data)
            }
        },
        complaint: {
            type: ComplaintType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parent, args) {
                return axios.get('http://localhost:3000/complaints/' + args.id)
                    .then(res => res.data)
            }
        },
        category: {
            type: new GraphQLList(CategoryType),
            resolve(parent, args) {
                return axios.get('http://localhost:3000/categoryes')
                    .then(res => res.data)
            }
        },
        alert: {
            type: AlertType,
            resolve(parent, args) {
                return axios.get('http://localhost:3000/alerts')
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