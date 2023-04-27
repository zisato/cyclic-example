import { Router } from 'express'
import { Container } from '../container/container'

export interface RouterConfiguration {
    getRoutersConfiguration(container: Container): Router[]
}
