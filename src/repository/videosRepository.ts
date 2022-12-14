import {VideoDBType} from "../types/types";
import {videosCollection} from "./db";


export const videosRepository = {
    async createNewVideo(newVideo: VideoDBType) {
        await videosCollection.insertMany(newVideo)
        const {_id, ...newVideoCopy} = newVideo
        return newVideoCopy
    },
    async updateVideo(id: number, title:string, author:string,
                      availableResolutions: [], canBeDownloaded: boolean,
                      minAgeRestriction:number, publicationDate: Date){
       const updateVideo =  await videosCollection.updateOne({id}, {$set:{title, author, availableResolutions,
                canBeDownloaded, minAgeRestriction, publicationDate: publicationDate }})
        return updateVideo.matchedCount === 1
    },
    async deleteVideo(id: number){
        const deleteVideo = await videosCollection.deleteOne({id})
        return deleteVideo.deletedCount === 1
    }

}