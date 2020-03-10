import apollo from 'apollo-server';
import {SessionModel, UserModel} from '../../Models.js';


const {ApolloServer, SchemaDirectiveVisitor} = apollo;

export default {
    auth: class AuthDirective extends SchemaDirectiveVisitor {
        visitObject(type) {
            this.ensureFieldsWrapped(type);
            type._requiredAuthRole = this.args.use;
        }

        visitFieldDefinition(field, details) {
            this.ensureFieldsWrapped(details.objectType);
            field._requiredAuthRole = this.args.use;
        }

        ensureFieldsWrapped(objectType) {

            if (objectType._authFieldsWrapped) return;
            objectType._authFieldsWrapped = true;

            const fields = objectType.getFields();

            Object.keys(fields).forEach(fieldName => {
                const field = fields[fieldName];
                const {resolve = defaultFieldResolver} = field;
                field.resolve = async function (...args) {
                    const context = args[2];

                    const requiredRole =
                        field._requiredAuthRole ||
                        objectType._requiredAuthRole;

                    if (requiredRole === undefined)
                        return resolve.apply(this, args);

                    if (context.headers['token'] === undefined)
                        throw new Error('Session key is not defined');

                    const session = await SessionModel.findOne({token: context.headers['token']});
                    if (session === undefined)
                        throw new Error('Token is not valid');

                    context.user = await UserModel.findOne({_id: session.userId});
                    return resolve.apply(this, args);
                };
            });
        }
    }
}