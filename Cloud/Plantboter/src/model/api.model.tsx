export interface ApiModel{
    id: Number,
    key: String,
    status: String,
    expire_at?: Date,
    controllerId: Number,
    createdAt: Date,
    updatedAt: Date
}