import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
  DateTime: Date,
};

export type Author = {
   __typename?: 'Author',
  id: Scalars['ID'],
  name: Scalars['String'],
  /** Other books written by the author and also stored in the database */
  booksWritten?: Maybe<Array<Maybe<Book>>>,
};

export type Book = {
   __typename?: 'Book',
  id: Scalars['ID'],
  /** ISBN number of the book */
  isbn?: Maybe<Scalars['String']>,
  /** Date of first publication */
  publishedDate?: Maybe<Scalars['DateTime']>,
  /** Synopsis of the book */
  synopsis?: Maybe<Scalars['String']>,
  /** Book's title */
  title: Scalars['String'],
  /** A user's entries on the given Book */
  entries?: Maybe<Array<Maybe<Entry>>>,
  /** A list of authors for a given book */
  authors?: Maybe<Array<Maybe<Author>>>,
};


export type Entry = {
   __typename?: 'Entry',
  id: Scalars['ID'],
  /** Chapter relating to the note */
  chapter?: Maybe<Scalars['String']>,
  /** Database generated timestamp of entry creation */
  createdAt: Scalars['DateTime'],
  /** User supplied notes for the entry */
  notes?: Maybe<Scalars['String']>,
  /** Page the notes are referencing */
  page?: Maybe<Scalars['Int']>,
  /** Quoted text from the book */
  quote?: Maybe<Scalars['String']>,
  owner?: Maybe<User>,
  book?: Maybe<Book>,
};

export type IsbnBook = {
   __typename?: 'ISBNBook',
  authors: Array<Scalars['String']>,
  date_published: Scalars['String'],
  dewey_decimal?: Maybe<Scalars['String']>,
  dimensions?: Maybe<Scalars['String']>,
  edition?: Maybe<Scalars['String']>,
  excerpt?: Maybe<Scalars['String']>,
  format?: Maybe<Scalars['String']>,
  image?: Maybe<Scalars['String']>,
  isbn: Scalars['String'],
  isbn13: Scalars['String'],
  language?: Maybe<Scalars['String']>,
  msrp?: Maybe<Scalars['Int']>,
  overview?: Maybe<Scalars['String']>,
  pages?: Maybe<Scalars['Int']>,
  publisher?: Maybe<Scalars['String']>,
  reviews?: Maybe<Array<Scalars['String']>>,
  subjects?: Maybe<Array<Scalars['String']>>,
  synopsys?: Maybe<Scalars['String']>,
  title: Scalars['String'],
  title_long?: Maybe<Scalars['String']>,
};

export type Mutation = {
   __typename?: 'Mutation',
  updateUser?: Maybe<User>,
  createEntry?: Maybe<Entry>,
  updateEntry?: Maybe<Entry>,
  removeEntry?: Maybe<Scalars['ID']>,
  addToMyBooks?: Maybe<Book>,
  removeMyBook?: Maybe<User>,
};


export type MutationUpdateUserArgs = {
  user: UserInput
};


export type MutationCreateEntryArgs = {
  input: NewEntryInput
};


export type MutationUpdateEntryArgs = {
  input: UpdateEntryInput
};


export type MutationRemoveEntryArgs = {
  id: Scalars['ID']
};


export type MutationAddToMyBooksArgs = {
  isbn: Scalars['String']
};


export type MutationRemoveMyBookArgs = {
  id: Scalars['ID']
};

export type NewEntryInput = {
  book: Scalars['ID'],
  chapter?: Maybe<Scalars['String']>,
  notes?: Maybe<Scalars['String']>,
  page?: Maybe<Scalars['Int']>,
  quote?: Maybe<Scalars['String']>,
};

export type Query = {
   __typename?: 'Query',
  me?: Maybe<User>,
  myBooks?: Maybe<Array<Maybe<Book>>>,
  myEntries?: Maybe<Array<Maybe<Entry>>>,
  entry?: Maybe<Entry>,
  allAuthors?: Maybe<Array<Maybe<Author>>>,
  author?: Maybe<Author>,
  allBooks?: Maybe<Array<Maybe<Book>>>,
  book?: Maybe<Book>,
  isbnBooks: Array<IsbnBook>,
};


export type QueryEntryArgs = {
  id: Scalars['ID']
};


export type QueryAuthorArgs = {
  id: Scalars['ID']
};


export type QueryBookArgs = {
  id: Scalars['ID']
};


export type QueryIsbnBooksArgs = {
  name: Scalars['String']
};

export type UpdateEntryInput = {
  id: Scalars['ID'],
  chapter?: Maybe<Scalars['String']>,
  notes?: Maybe<Scalars['String']>,
  page?: Maybe<Scalars['Int']>,
  quote?: Maybe<Scalars['String']>,
};

export type User = {
   __typename?: 'User',
  id: Scalars['ID'],
  /** User's name from oAuth provider */
  name?: Maybe<Scalars['String']>,
  /** User's profile image from oAuth provider */
  picture?: Maybe<Scalars['String']>,
  /** Unique oAuth identifier */
  sub: Scalars['String'],
  entries?: Maybe<Array<Maybe<Entry>>>,
  /** A user's collection of books to take notes on */
  books?: Maybe<Array<Maybe<Book>>>,
};

export type UserInput = {
  name?: Maybe<Scalars['String']>,
  picture?: Maybe<Scalars['String']>,
  sub: Scalars['String'],
};


export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;


export type StitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Query: ResolverTypeWrapper<{}>,
  User: ResolverTypeWrapper<User>,
  ID: ResolverTypeWrapper<Scalars['ID']>,
  String: ResolverTypeWrapper<Scalars['String']>,
  Entry: ResolverTypeWrapper<Entry>,
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>,
  Int: ResolverTypeWrapper<Scalars['Int']>,
  Book: ResolverTypeWrapper<Book>,
  Author: ResolverTypeWrapper<Author>,
  ISBNBook: ResolverTypeWrapper<IsbnBook>,
  Mutation: ResolverTypeWrapper<{}>,
  UserInput: UserInput,
  NewEntryInput: NewEntryInput,
  UpdateEntryInput: UpdateEntryInput,
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>,
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Query: {},
  User: User,
  ID: Scalars['ID'],
  String: Scalars['String'],
  Entry: Entry,
  DateTime: Scalars['DateTime'],
  Int: Scalars['Int'],
  Book: Book,
  Author: Author,
  ISBNBook: IsbnBook,
  Mutation: {},
  UserInput: UserInput,
  NewEntryInput: NewEntryInput,
  UpdateEntryInput: UpdateEntryInput,
  Boolean: Scalars['Boolean'],
};

export type AuthorResolvers<ContextType = any, ParentType extends ResolversParentTypes['Author'] = ResolversParentTypes['Author']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  booksWritten?: Resolver<Maybe<Array<Maybe<ResolversTypes['Book']>>>, ParentType, ContextType>,
};

export type BookResolvers<ContextType = any, ParentType extends ResolversParentTypes['Book'] = ResolversParentTypes['Book']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  isbn?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  publishedDate?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>,
  synopsis?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  entries?: Resolver<Maybe<Array<Maybe<ResolversTypes['Entry']>>>, ParentType, ContextType>,
  authors?: Resolver<Maybe<Array<Maybe<ResolversTypes['Author']>>>, ParentType, ContextType>,
};

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime'
}

export type EntryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Entry'] = ResolversParentTypes['Entry']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  chapter?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>,
  notes?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  page?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
  quote?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  owner?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>,
  book?: Resolver<Maybe<ResolversTypes['Book']>, ParentType, ContextType>,
};

export type IsbnBookResolvers<ContextType = any, ParentType extends ResolversParentTypes['ISBNBook'] = ResolversParentTypes['ISBNBook']> = {
  authors?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>,
  date_published?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  dewey_decimal?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  dimensions?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  edition?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  excerpt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  format?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  image?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  isbn?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  isbn13?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  language?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  msrp?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
  overview?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  pages?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
  publisher?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  reviews?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>,
  subjects?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>,
  synopsys?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  title_long?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  updateUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationUpdateUserArgs, 'user'>>,
  createEntry?: Resolver<Maybe<ResolversTypes['Entry']>, ParentType, ContextType, RequireFields<MutationCreateEntryArgs, 'input'>>,
  updateEntry?: Resolver<Maybe<ResolversTypes['Entry']>, ParentType, ContextType, RequireFields<MutationUpdateEntryArgs, 'input'>>,
  removeEntry?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType, RequireFields<MutationRemoveEntryArgs, 'id'>>,
  addToMyBooks?: Resolver<Maybe<ResolversTypes['Book']>, ParentType, ContextType, RequireFields<MutationAddToMyBooksArgs, 'isbn'>>,
  removeMyBook?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationRemoveMyBookArgs, 'id'>>,
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  me?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>,
  myBooks?: Resolver<Maybe<Array<Maybe<ResolversTypes['Book']>>>, ParentType, ContextType>,
  myEntries?: Resolver<Maybe<Array<Maybe<ResolversTypes['Entry']>>>, ParentType, ContextType>,
  entry?: Resolver<Maybe<ResolversTypes['Entry']>, ParentType, ContextType, RequireFields<QueryEntryArgs, 'id'>>,
  allAuthors?: Resolver<Maybe<Array<Maybe<ResolversTypes['Author']>>>, ParentType, ContextType>,
  author?: Resolver<Maybe<ResolversTypes['Author']>, ParentType, ContextType, RequireFields<QueryAuthorArgs, 'id'>>,
  allBooks?: Resolver<Maybe<Array<Maybe<ResolversTypes['Book']>>>, ParentType, ContextType>,
  book?: Resolver<Maybe<ResolversTypes['Book']>, ParentType, ContextType, RequireFields<QueryBookArgs, 'id'>>,
  isbnBooks?: Resolver<Array<ResolversTypes['ISBNBook']>, ParentType, ContextType, RequireFields<QueryIsbnBooksArgs, 'name'>>,
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  picture?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  sub?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  entries?: Resolver<Maybe<Array<Maybe<ResolversTypes['Entry']>>>, ParentType, ContextType>,
  books?: Resolver<Maybe<Array<Maybe<ResolversTypes['Book']>>>, ParentType, ContextType>,
};

export type Resolvers<ContextType = any> = {
  Author?: AuthorResolvers<ContextType>,
  Book?: BookResolvers<ContextType>,
  DateTime?: GraphQLScalarType,
  Entry?: EntryResolvers<ContextType>,
  ISBNBook?: IsbnBookResolvers<ContextType>,
  Mutation?: MutationResolvers<ContextType>,
  Query?: QueryResolvers<ContextType>,
  User?: UserResolvers<ContextType>,
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
*/
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
