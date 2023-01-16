import { GraphQLScalarType, ASTNode } from 'graphql';
export declare const LOCAL_TIME_FORMAT: RegExp;
export declare function validateLocalTime(value: any, ast?: ASTNode): string;
export declare const GraphQLLocalTime: GraphQLScalarType;
