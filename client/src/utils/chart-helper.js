export const calculateDevicesUptime = (messages, includeInactiveDays) => {
  const latestOn = {};
  const dayTotal = {};
  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });

  if (includeInactiveDays) {
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      let formattedDate = date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
      });
      if (formattedDate === today) {
        formattedDate = "Today";
      }
      dayTotal[formattedDate] = { date: formattedDate, total: 0 };
    }
  }

  Object.values(messages).forEach((message) => {
    const { name, action, timeSent } = message;
    const date = new Date(timeSent);
    let formattedDate = date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
    });

    if (formattedDate === today) {
      formattedDate = "Today";
    }

    if (action === "on") {
      latestOn[name] = { time: timeSent, date: formattedDate };
    } else if (action === "off" && latestOn[name] !== undefined) {
      const onDate = new Date(latestOn[name].time);
      let onFormattedDate = onDate.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
      });
      if (onFormattedDate === today) {
        onFormattedDate = "Today";
      }

      let currentDate = new Date(onDate);
      currentDate.setHours(23, 59, 59, 999);
      let remainingTime = timeSent - currentDate.getTime();

      const firstDayHours =
        (currentDate.getTime() - onDate.getTime()) / 3600000;
      if (!dayTotal[onFormattedDate]) {
        dayTotal[onFormattedDate] = { date: onFormattedDate, total: 0 };
      }
      dayTotal[onFormattedDate].total += firstDayHours;
      if (!dayTotal[onFormattedDate][name]) {
        dayTotal[onFormattedDate][name] = 0;
      }
      dayTotal[onFormattedDate][name] += firstDayHours;

      currentDate.setDate(currentDate.getDate() + 1);
      currentDate.setHours(0, 0, 0, 0);
      onFormattedDate = currentDate.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
      });
      if (onFormattedDate === today) {
        onFormattedDate = "Today";
      }

      while (remainingTime > 86400000) {
        if (!dayTotal[onFormattedDate]) {
          dayTotal[onFormattedDate] = { date: onFormattedDate, total: 0 };
        }
        dayTotal[onFormattedDate].total += 24;
        if (!dayTotal[onFormattedDate][name]) {
          dayTotal[onFormattedDate][name] = 0;
        }
        dayTotal[onFormattedDate][name] += 24;

        remainingTime -= 86400000;
        currentDate.setDate(currentDate.getDate() + 1);
        onFormattedDate = currentDate.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
        });
        if (onFormattedDate === today) {
          onFormattedDate = "Today";
        }
      }

      const lastDayHours = remainingTime / 3600000;
      if (!dayTotal[formattedDate]) {
        dayTotal[formattedDate] = { date: formattedDate, total: 0 };
      }
      dayTotal[formattedDate].total += lastDayHours;
      if (!dayTotal[formattedDate][name]) {
        dayTotal[formattedDate][name] = 0;
      }
      dayTotal[formattedDate][name] += lastDayHours;

      delete latestOn[name];
    }
  });

  const sortedDayTotal = Object.values(dayTotal).sort((a, b) => {
    const dateA = new Date(a.date === "Today" ? today : a.date);
    const dateB = new Date(b.date === "Today" ? today : b.date);
    return dateA - dateB;
  });

  const finalDayTotal = includeInactiveDays
    ? sortedDayTotal
    : sortedDayTotal.filter((entry) => entry.total > 0);

  return finalDayTotal;
};

export const extractHighestUsage = (consumptionAndCostData, devices) => {
  const insights = consumptionAndCostData.map((data) => {
    let highest = {
      name: null,
      cost: 0,
      usage: 0,
      consumption: 0,
    };

    let total = {
      usage: 0,
      cost: 0,
      consumption: 0,
    };

    Object.entries(devices).forEach(([key, value]) => {
      if (data[value.name] !== undefined) {
        const deviceData = data[value.name];
        total.usage += (deviceData.consumption * 1000) / value.powerRating;
        total.cost += deviceData.cost;
        total.consumption += deviceData.consumption;

        if (deviceData.consumption > highest.consumption) {
          highest = {
            name: value.name,
            cost: deviceData.cost,
            usage: (deviceData.consumption * 1000) / value.powerRating,
            consumption: deviceData.consumption,
          };
        }
      }
    });

    return {
      date: data.date,
      highest,
      total,
    };
  });

  return insights.reverse();
};

export const calculateConsumptionAndCost = (
  chartData,
  devices,
  rate = 10.12
) => {
  const days = chartData.map((data) => {
    const consumptionData = Object.entries(devices).reduce(
      (acc, [key, value]) => {
        if (data[value.name] !== undefined) {
          const deviceUptime = data[value.name];
          const deviceConsumption = (deviceUptime * value.powerRating) / 1000;
          const deviceCost = deviceConsumption * rate;
          acc[value.name] = {
            consumption: deviceConsumption,
            cost: deviceCost,
          };
        }
        return acc;
      },
      {}
    );
    const Total = Object.values(consumptionData).reduce(
      (sum, val) => {
        sum.consumption += val.consumption;
        sum.cost += val.cost;
        return sum;
      },
      { consumption: 0, cost: 0 }
    );

    return { ...data, ...consumptionData, Total };
  });

  const total = days.reduce(
    (acc, day) => {
      acc.cost += day.Total.cost;
      acc.consumption += day.Total.consumption;
      return acc;
    },
    { cost: 0, consumption: 0 }
  );

  return { days, total };
};

export const divideDataByMonth = (data) => {
  const months = new Map();

  data.forEach((item) => {
    const date = new Date(item.timeSent);
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    const key = `${month} ${year}`;

    if (!months.has(key)) {
      months.set(key, []);
    }

    months.get(key).push(item);
  });

  const result = {};
  months.forEach((value, key) => {
    result[key] = value;
  });

  return result;
};
