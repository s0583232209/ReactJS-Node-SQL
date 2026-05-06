export async function DAL_refreshToken(userId) {
    try {
        log.info(`DAL_refreshToken called for userId: ${userId}`);
        const connection = await getConnection();
        const [rows] = await connection.execute('SELECT refresh_token FROM users WHERE id = ?', [userId]);
        return rows[0];
    } catch (error) {
        console.error('Error in DAL_refreshToken:', error);
        throw error;
    }
    
}