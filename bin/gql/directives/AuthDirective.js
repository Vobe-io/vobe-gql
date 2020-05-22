import apollo from "apollo-server";
import graphql from "graphql";

const { SchemaDirectiveVisitor } = apollo;
const { defaultFieldResolver } = graphql;

export default {
    auth: class AuthDirective extends SchemaDirectiveVisitor {
        visitObject(type) {
            this.ensureFieldsWrapped(type);
            type._requiredAuthRoles = this.args.roles;
            type._requiredScopes = this.args.scopes;
        }

        visitFieldDefinition(field, details) {
            this.ensureFieldsWrapped(details.objectType);
            field._requiredAuthRoles = this.args.roles;
            field._requiredScopes = this.args.scopes;
        }

        ensureFieldsWrapped(objectType) {
            if (objectType._authFieldsWrapped) return;
            objectType._authFieldsWrapped = true;

            const fields = objectType.getFields();
            Object.keys(fields).forEach((fieldName) => {
                const field = fields[fieldName];
                const { resolve = defaultFieldResolver } = field;
                field.resolve = async function (..._args) {
                    const [parent, args, context, info] = _args;
                    const requiredRoles =
                        field._requiredAuthRoles ||
                        objectType._requiredAuthRoles;
                    const requiredScopes =
                        field._requiredScopes || objectType._requiredScopes;
                    if (
                        requiredScopes === undefined &&
                        requiredRoles === undefined
                    )
                        return await resolve.apply(this, _args);

                    if (!context.user) return null;

                    if (
                        args._id &&
                        args._id.toString() === context.user._id.toString()
                    )
                        return await resolve.apply(this, _args);

                    if (
                        parent &&
                        (parent._id.toString() ===
                            context.user._id.toString() ||
                            (parent.owner &&
                                parent.owner.toString() ===
                                    context.user._id.toString()))
                    )
                        return await resolve.apply(this, _args);

                    if (requiredScopes && parent)
                        for (var scope of parent.scopes) {
                            if (
                                scope._id.toString() ===
                                    context.user._id.toString() &&
                                requiredScopes.includes(scope.name)
                            )
                                return await resolve.apply(this, _args);
                        }

                    if (
                        requiredRoles &&
                        requiredRoles.includes(context.user.role)
                    )
                        return await resolve.apply(this, _args);

                    return null;
                };
            });
        }
    },
};
