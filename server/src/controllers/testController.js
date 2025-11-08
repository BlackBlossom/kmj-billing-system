import mongoose from 'mongoose';

export const testCollections = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    
    // Get all collection names
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    console.log('Available collections:', collectionNames);
    
    // Sample documents from each collection
    const samples = {};
    
    for (const name of collectionNames) {
      const collection = db.collection(name);
      const count = await collection.countDocuments();
      const sample = await collection.findOne();
      
      samples[name] = {
        count,
        sampleDocument: sample
      };
    }
    
    res.json({
      success: true,
      collections: collectionNames,
      samples
    });
  } catch (error) {
    console.error('Error testing collections:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
