import mongoose from 'mongoose';

const counterSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    sequenceValue: {
      type: Number,
      default: 0,
      required: true,
    },
    prefix: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      trim: true,
    },
    lastResetDate: {
      type: Date,
    },
    resetFrequency: {
      type: String,
      enum: ['never', 'yearly', 'monthly', 'daily'],
      default: 'never',
    },
  },
  {
    timestamps: true,
  }
);

// MongoDB automatically creates a unique index on _id, no need to define it

// Static method to get next sequence value
counterSchema.statics.getNextSequence = async function (sequenceName) {
  const counter = await this.findByIdAndUpdate(
    sequenceName,
    {
      $inc: { sequenceValue: 1 },
      $setOnInsert: {
        _id: sequenceName,
        lastResetDate: new Date(),
      },
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    }
  );

  return counter.sequenceValue;
};

// Static method to get current sequence value without incrementing
counterSchema.statics.getCurrentSequence = async function (sequenceName) {
  const counter = await this.findById(sequenceName);
  return counter ? counter.sequenceValue : 0;
};

// Static method to reset sequence
counterSchema.statics.resetSequence = async function (sequenceName, value = 0) {
  const counter = await this.findByIdAndUpdate(
    sequenceName,
    {
      $set: {
        sequenceValue: value,
        lastResetDate: new Date(),
      },
    },
    {
      new: true,
      upsert: true,
    }
  );

  return counter;
};

// Static method to set sequence value
counterSchema.statics.setSequence = async function (sequenceName, value) {
  const counter = await this.findByIdAndUpdate(
    sequenceName,
    {
      $set: { sequenceValue: value },
    },
    {
      new: true,
      upsert: true,
    }
  );

  return counter;
};

// Static method to initialize default counters
counterSchema.statics.initializeCounters = async function () {
  const defaultCounters = [
    {
      _id: 'bill',
      prefix: 'BILL',
      description: 'Main bill receipt numbers',
      resetFrequency: 'yearly',
    },
    {
      _id: 'account_land',
      prefix: 'LAN',
      description: 'Land account receipt numbers',
      resetFrequency: 'yearly',
    },
    {
      _id: 'account_madrassa',
      prefix: 'MAD',
      description: 'Madrassa account receipt numbers',
      resetFrequency: 'yearly',
    },
    {
      _id: 'account_nercha',
      prefix: 'NER',
      description: 'Nercha account receipt numbers',
      resetFrequency: 'yearly',
    },
    {
      _id: 'account_sadhu',
      prefix: 'SAD',
      description: 'Sadhu account receipt numbers',
      resetFrequency: 'yearly',
    },
    {
      _id: 'eid_anual',
      prefix: 'EID',
      description: 'Eid/Annual contribution receipt numbers',
      resetFrequency: 'yearly',
    },
    {
      _id: 'member_id',
      prefix: 'MEM',
      description: 'Member ID sequence',
      resetFrequency: 'never',
    },
  ];

  const operations = defaultCounters.map((counter) =>
    this.updateOne(
      { _id: counter._id },
      {
        $setOnInsert: {
          ...counter,
          sequenceValue: 0,
          lastResetDate: new Date(),
        },
      },
      { upsert: true }
    )
  );

  await Promise.all(operations);
  console.log('✅ Default counters initialized');
};

// Static method to check and reset counters based on frequency
counterSchema.statics.checkAndResetCounters = async function () {
  const now = new Date();
  const counters = await this.find({
    resetFrequency: { $ne: 'never' },
  });

  for (const counter of counters) {
    let shouldReset = false;

    switch (counter.resetFrequency) {
      case 'yearly':
        const lastYear = counter.lastResetDate.getFullYear();
        const currentYear = now.getFullYear();
        shouldReset = lastYear < currentYear;
        break;

      case 'monthly':
        const lastMonth = counter.lastResetDate.getMonth();
        const currentMonth = now.getMonth();
        const lastMonthYear = counter.lastResetDate.getFullYear();
        const currentMonthYear = now.getFullYear();
        shouldReset =
          lastMonthYear < currentMonthYear ||
          (lastMonthYear === currentMonthYear && lastMonth < currentMonth);
        break;

      case 'daily':
        const lastDate = counter.lastResetDate.toDateString();
        const currentDate = now.toDateString();
        shouldReset = lastDate !== currentDate;
        break;
    }

    if (shouldReset) {
      await this.resetSequence(counter._id, 0);
      console.log(`✅ Counter ${counter._id} reset`);
    }
  }
};

// Static method to get all counters with their current values
counterSchema.statics.getAllCounters = async function () {
  return await this.find().sort({ _id: 1 }).exec();
};

// Instance method to increment
counterSchema.methods.increment = async function () {
  this.sequenceValue += 1;
  return await this.save();
};

// Instance method to reset
counterSchema.methods.reset = async function (value = 0) {
  this.sequenceValue = value;
  this.lastResetDate = new Date();
  return await this.save();
};

const Counter = mongoose.model('Counter', counterSchema);

export default Counter;
