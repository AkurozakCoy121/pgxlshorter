export default async function handler(req, res) {
    const { userId } = req.query;
    
    if (!userId) {
        return res.status(400).json({ error: "UserId dibutuhkan" });
    }

    try {
        // Ambil data dari API resmi Roblox
        const response = await fetch(`https://users.roblox.com/v1/users/${userId}`);
        const data = await response.json();

        if (data.errors) {
            return res.status(404).json({ error: "User tidak ditemukan" });
        }

        res.status(200).json({
            name: data.name,
            displayName: data.displayName
        });
    } catch (error) {
        res.status(500).json({ error: "Server Error" });
    }
}
