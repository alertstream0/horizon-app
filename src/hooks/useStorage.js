import { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../services/firebase';

const useStorage = () => {
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);
    const [url, setUrl] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const uploadFile = async (file, path) => {
        setIsUploading(true);
        setError(null);
        setProgress(0);

        return new Promise((resolve, reject) => {
            if (!file) {
                setError('No file selected');
                setIsUploading(false);
                reject('No file selected');
                return;
            }

            // Sanitize filename to avoid path issues
            const sanitizedName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
            const finalPath = `${path}/${Date.now()}_${sanitizedName}`;
            const storageRef = ref(storage, finalPath);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on('state_changed',
                (snapshot) => {
                    const prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setProgress(prog);
                },
                (err) => {
                    setError(err);
                    setIsUploading(false);
                    reject(err);
                },
                async () => {
                    try {
                        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
                        setUrl(downloadUrl);
                        setIsUploading(false);
                        resolve(downloadUrl);
                    } catch (err) {
                        setError(err);
                        setIsUploading(false);
                        reject(err);
                    }
                }
            );
        });
    };

    return { uploadFile, progress, error, url, isUploading };
};

export default useStorage;
