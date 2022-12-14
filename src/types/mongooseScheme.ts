import mongoose from "mongoose";
import {
    AttemptsType,
    BlogDBType,
    CommentDBModalType, LikeStatus,
    PostDBType, RecoveryCodeType,
    TokenType,
    UserDBType,
    UserSessionsType,
    VideoDBType
} from "./types";
import {ObjectId} from "mongodb";

export const VideoModelScheme = new mongoose.Schema<VideoDBType>({
    id: Number,
    title: String,
    author: String,
    canBeDownloaded: Boolean,
    minAgeRestriction: Number,
    createdAt: Date,
    publicationDate: Date,
    availableResolutions: [],
    _id: ObjectId
})

export const BlogsDBModalScheme = new mongoose.Schema<BlogDBType>({
    _id: {type:ObjectId, select:false},
    id: String,
    name: String,
    description: String,
    websiteUrl: String,
    createdAt: Date,
})
export const  PostDBModalScheme = new mongoose.Schema<PostDBType>({
    _id: ObjectId,
    id: String,
    title: String,
    shortDescription: String,
    content: String,
    blogId: String,
    blogName: String,
    createdAt: Date,
    extendedLikesInfo: {
        likesCount: Number,
        dislikesCount: Number,
        myStatus: String,
        newestLikes: []
    }
})

export const UserDBModalScheme = new mongoose.Schema<UserDBType>({
    _id: ObjectId,
    id: String,
    login: String,
    email: String,
    createdAt: Date,
    passwordHash: String,
    emailConfirmation: {
        confirmationCode: String,
        expirationDate: Date,
        isConfirmed: Boolean,
    }
})
export const CommentDBModalScheme = new mongoose.Schema<CommentDBModalType>({
    _id: ObjectId,
    id: String,
    content: String,
    userId: String,
    userLogin: String,
    createdAt: Date,
    postId: String,
    likesInfo: {
        likesCount: Number,
        dislikesCount: Number,
        myStatus: String
    },
})

export const AttemptsModalScheme = new mongoose.Schema<AttemptsType>({
    userIP: String,
    url: String,
    time: Date
})

export const TokenModalScheme = new mongoose.Schema<TokenType>({
    refreshToken: String
})

export const RecoveryCodeScheme = new mongoose.Schema<RecoveryCodeType>({
    email: String,
    recoveryCode: String
})

export const UserSessionsScheme = new mongoose.Schema<UserSessionsType>({
    ip: String,
    title: String,
    lastActiveDate: Date,
    deviceId: String,
    userId:String,
})

export const LikeStatusScheme = new mongoose.Schema<LikeStatus>({
    parentId: String,
    userId:String,
    login: String,
    likeStatus: String,
    addedAt: Date,
})