const { ApolloServer, gql } = require("apollo-server-koa");
const { Users } = require("./mongoose/user");
const { Validation_root_Group } = require("./util/Format");

const typeDefs = gql`
  scalar Date
  #data type
  type user {
    userId: ID
    name: String
    user: String
    userGroup: String
    mail: String
    orgin: String
    tel: Int
    creatTime: Date
    modifyTime: Date
    address: String
    status: Boolean
  }
  type result {
    msg: String
    ok: Int
    n: Int
    nModified: Int
  }

  #Query
  type Query {
    hello: String
    User(user: String, mail: String): user
    Users: [user]
  }

  #mutation
  type Mutation {
    #admin
    modify_select_user(user: String): result
    disable_select_user(user: String, status: Boolean): result
    delete_select_user(user: String): result
    #register
    userRegister(arg: String): result
  }
`;

const resolvers = {
  Query: {
    //
    async User(root, { user, mail }) {
      return await Users.findOne({
        $or: [{ user: user || "" }, { mail: mail || null }]
      });
    },
    //
    async Users() {
      return await Users.find();
    }
  },
  Mutation: {
    //async userRegister(root, { arg }) {
    //let { company, mail, passwd, passwd2, tel, user } = JSON.parse(arg);
    //},
    async modify_select_user(root, arg) {
      let { user, mail, name, orgin, tel, userGroup } = JSON.parse(arg.user);
      userGroup = userGroup == "user" ? userGroup : "user";
      if (await Validation_root_Group(user))
        return { ok: 0, msg: "禁止修改管理组账户状态" };
      return await Users.updateOne(
        { user },
        { $set: { mail, name, orgin, tel, userGroup, modifyTime: new Date() } }
      );
    },
    //
    async disable_select_user(root, { user, status }) {
      if (await Validation_root_Group(user))
        return { ok: 0, msg: "禁止修改管理组账户状态" };
      return await Users.updateOne(
        { user },
        {
          $set: { status: JSON.parse(status), modifyTime: new Date() }
        }
      );
    },
    //
    async delete_select_user(root, { user }) {
      if (await Validation_root_Group(user))
        return { ok: 0, msg: "禁止修改管理组账户状态" };
      return await Users.deleteOne({ user });
    }
  }
};

module.exports = new ApolloServer({ typeDefs, resolvers });
