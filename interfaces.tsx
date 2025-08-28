// import { UIMessage } from "ai";

export interface IExplainerVideo {
    id: string;
    user_id: string;
    title: string;
    videoUrl: string;
    thumbnailUrl: string;
    created: Date;
    user: IUser;
    views: number|0;
    videoId: string;
    streamUrl: string;
    streamId: string;
    sections:string;
    comments?: Comment[];
    likes: ILike[];
    public: boolean;
    generating:boolean;
    errored:boolean;
    errorMessage?:string;
    shareUrl?:string;
    totalDuration?:number;
    tags?: string[];
    // messages?:UIMessage[];
    watchedDuration?:number
}
export interface IExplainerPodcast {
    id: string;
    user_id: string;
    title: string;
    videoUrl: string;
    thumbnailUrl: string;
    created: Date;
    user: IUser;
    views: number|0;
    topic:string;
    comments?: Comment[];
    likes: ILike[];
    public: boolean;
    generating:boolean;
    errored:boolean;
    errorMessage?:string;
    shareUrl?:string;
    totalDuration?:number;
    tags?: string[];
    sectionAudios:SectionAudio[]
    // messages?:UIMessage[]
    transcript:string
    subtitleUrl?:string
    watchedDuration?:number
}

type SectionAudio= {
    name:string,
    duration:number,
    streamUrl:string
}

export interface IUser {
    id: string;
    email: string;
    name: string;
    password: string;
    username: string;
    created: Date;
    country?: string;
    group?: string;
    useragent?: string;
    bot?: boolean;
    imageUrl?: string;
    lastLogin?: Date;
    lastPlatformVisit?: Date;
    deleted?: boolean;
    subscribed: boolean;
    annualPlan: boolean;
    credits: number;
    plan: string;
    follower_count: number;
    hasCompletedQuestionnaire: boolean;
    stripeCustomerId?: string;
    erroredVideos?: Array<{
        id: string;
        title: string;
        errored: boolean;
        errorMessage?: string;
        created: Date;
    }>;
    explainerVideos?: IExplainerVideo;
    isOnboarding?:boolean;
    explainerPodcasts?: IExplainerPodcast;
}

export interface Comment {
    id: string;
    text: string;
    created: Date;
    user: IUser;
}

export interface ILike {
    id: string;
    user_id: string;
    explainerVideo_id: string;
    created: Date;
    user: IUser;
    explainerVideo: IExplainerVideo;
  }


export interface IExplainer extends IExplainerPodcast, IExplainerVideo{}