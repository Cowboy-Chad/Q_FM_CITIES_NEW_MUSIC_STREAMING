import { supabase } from '../lib/supabase'

const MUSIC_BUCKET = 'music'

/**
 * Upload a music file to Supabase Storage
 * @param {File|Blob} file - The audio file to upload
 * @param {string} path - Storage path (e.g., 'userId/artist/track.mp3')
 * @param {function} onProgress - Optional progress callback (0-100)
 * @returns {Promise<{path: string, publicUrl: string}>}
 */
export async function uploadMusicFile(file, path, onProgress = null) {
  try {
    if (!file) throw new Error('No file provided')

    const { data, error } = await supabase.storage
      .from(MUSIC_BUCKET)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type || 'audio/mpeg'
      })

    if (error) throw error

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(MUSIC_BUCKET)
      .getPublicUrl(data.path)

    if (onProgress) onProgress(100)

    return {
      path: data.path,
      publicUrl: urlData.publicUrl
    }
  } catch (error) {
    console.error('Upload error:', error)
    throw new Error(`Failed to upload file: ${error.message}`)
  }
}

/**
 * Delete a music file from Supabase Storage
 * @param {string} path - Storage path to delete
 */
export async function deleteMusicFile(path) {
  try {
    const { error } = await supabase.storage
      .from(MUSIC_BUCKET)
      .remove([path])

    if (error) throw error
  } catch (error) {
    console.error('Delete error:', error)
    throw new Error(`Failed to delete file: ${error.message}`)
  }
}

/**
 * List files in a storage path
 * @param {string} prefix - Path prefix to list
 */
export async function listMusicFiles(prefix = '') {
  try {
    const { data, error } = await supabase.storage
      .from(MUSIC_BUCKET)
      .list(prefix, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' }
      })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('List error:', error)
    throw new Error(`Failed to list files: ${error.message}`)
  }
}

/**
 * Get download URL for a file
 * @param {string} path - Storage path
 */
export function getMusicPublicUrl(path) {
  const { data } = supabase.storage
    .from(MUSIC_BUCKET)
    .getPublicUrl(path)
  return data.publicUrl
}
