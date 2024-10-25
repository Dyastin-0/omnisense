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

      const diff = timeSent - latestOn[name].time;
      const diffHours = diff / 3600000;

      if (formattedDate === onFormattedDate) {
        if (!dayTotal[onFormattedDate]) {
          dayTotal[onFormattedDate] = { date: onFormattedDate, total: 0 };
        }
        dayTotal[onFormattedDate].total += diffHours;
        if (!dayTotal[onFormattedDate][name]) {
          dayTotal[onFormattedDate][name] = 0;
        }
        dayTotal[onFormattedDate][name] += diffHours;
      } else {
        const endOfDay = new Date(onDate);
        endOfDay.setHours(23, 59, 59, 999);
        const firstDayHours = (endOfDay - onDate) / 3600000;

        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const secondDayHours = (date - startOfDay) / 3600000;

        if (!dayTotal[onFormattedDate]) {
          dayTotal[onFormattedDate] = { date: onFormattedDate, total: 0 };
        }
        dayTotal[onFormattedDate].total += firstDayHours;
        if (!dayTotal[onFormattedDate][name]) {
          dayTotal[onFormattedDate][name] = 0;
        }
        dayTotal[onFormattedDate][name] += firstDayHours;

        if (!dayTotal[formattedDate]) {
          dayTotal[formattedDate] = { date: formattedDate, total: 0 };
        }
        dayTotal[formattedDate].total += secondDayHours;
        if (!dayTotal[formattedDate][name]) {
          dayTotal[formattedDate][name] = 0;
        }
        dayTotal[formattedDate][name] += secondDayHours;
      }

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

export const extractHighestUsage = (data) => {
  const highestUsagePerDay = [];

  data.forEach((entry) => {
    let highestUsageDevice = null;
    let highestUsage = 0;
    Object.keys(entry).forEach((key) => {
      if (key !== "date" && key !== "total" && entry[key] > highestUsage) {
        highestUsage = entry[key];
        highestUsageDevice = key;
      }
    });
    highestUsagePerDay.push({
      date: entry.date,
      total: entry.total,
      highestDevice: highestUsageDevice,
      highestUsage: entry[highestUsageDevice],
    });
  });

  return highestUsagePerDay.reverse();
};

export const calculateConsumption = (chartData, devices) => {
  const updatedChartData = chartData.map((data) => {
    const consumptionData = Object.entries(devices).reduce(
      (acc, [key, value]) => {
        if (data[value.name] !== undefined) {
          const deviceUptime = data[value.name];
          const deviceConsumption = deviceUptime * value.powerRating;
          acc[value.name] = deviceConsumption;
        }
        return acc;
      },
      {}
    );
    const total = Object.values(consumptionData).reduce(
      (sum, val) => sum + val,
      0
    );
    return { ...data, ...consumptionData, total };
  });

  return updatedChartData;
};
