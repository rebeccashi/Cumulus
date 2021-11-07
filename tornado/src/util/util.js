const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

const retry = async (callback, count, description) => {
  console.log(`(Re)trying function: ${description}...`);

  try {
    return await callback();
  } catch (err) {
    console.log(`Function ${description} failed with ${count} tries left!`);
    if (count <= 0) {
      console.log(`Throwing this error to caller!`);
      throw err;
    }

    await sleep(1000);

    console.log(`Trying again now...`);
    return await retry(callback, count - 1);
  }
};

export { retry, sleep };
