export default function getImage(room) {

    const bucketId = process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ROOMS;
    const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT;
    const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
    
    
    const imageUrl = `${endpoint}/storage/buckets/${bucketId}/files/${room.image}/view?project=${projectId}`;
    
    return room.image ? imageUrl : "/images/no-image.jpg";
}

