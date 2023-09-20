#!/usr/bin/env node
import { getArgs } from './helpers/args.js'
import { getIcon, getWeather } from './services/api.service.js'
import { TOKEN_DICTIONARY, getKeyValue, saveKeyValue } from './services/storage.service.js'
import { printError, printHelp, printSuccess, printWeather } from './services/log.service.js'

const saveToken = async (token) => {
  if (!token.length) {
    printError('Не передан token')
    return
  }
  try {
    await saveKeyValue(TOKEN_DICTIONARY.token, token)
    printSuccess('Токен сохранён')
  } catch (error) {
    printError(error.message)
  }
}

const saveCity = async (city) => {
  if (!city.length) {
    printError('Не передан город')
    return
  }
  try {
    await saveKeyValue(TOKEN_DICTIONARY.city, city)
    printSuccess('Город сохранён')
  } catch (error) {
    printError(error.message)
  }
}

const getForecats = async () => {
  try {
    const city = process.env.CITY ?? await getKeyValue(TOKEN_DICTIONARY.city)
    const weather = await getWeather(city)
    printWeather(weather, getIcon(weather.weather[0].icon))
  } catch (error) {
    if (error?.response?.status === 404) {
      printError('Неверно указан город')
    } else if (error?.response?.status === 401) {
      printError('Неверно указан токен')
    } else {
      printError(error.message)
    }
  }
}

const initCLI = () => {
  const args = getArgs(process.argv)
  if (args.h) {
    return printHelp()
  }
  if (args.s) {
    return saveCity(args.s)
  }
  if (args.t) {
    return saveToken(args.t)
  }
  return getForecats()
}

initCLI()