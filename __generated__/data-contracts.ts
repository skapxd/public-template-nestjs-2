/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface SendMessageDTO {
  /** @default "573000000000" */
  phone: string;
  /** @default "Hello world" */
  message: string;
}

export interface NotificationsDto {
  /** @default "notification" */
  event: string;
  /** @default "notification value" */
  data: string;
}

export interface Counter {
  /** @default 0 */
  counter: number;
}

export interface CounterDto {
  /** @default "counter" */
  event: string;
  data: Counter;
}

export interface QueueDTO {
  /** @default "audio.mp3" */
  file: string;
}

export interface FileDTO {
  /** @format binary */
  file: File;
}

export type CreateMongooseDto = object;

export type UpdateMongooseDto = object;

export interface CreateTypeormDto {
  /** @default "label" */
  label: string;
  /** @default "label" */
  value: string;
}

export interface UpdateTypeormDto {
  /** @default "label" */
  label?: string;
  /** @default "label" */
  value?: string;
}
