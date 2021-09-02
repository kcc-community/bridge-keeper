CREATE TABLE `event`
(
    `id`           bigint(20) unsigned NOT NULL AUTO_INCREMENT,
    `chain`        varchar(32)         NOT NULL,
    `address`      varchar(64)         NOT NULL,
    `block_hash`   varchar(128)        NOT NULL,
    `block_number` bigint(20) unsigned NOT NULL,
    `version`      int(10) unsigned    NOT NULL DEFAULT '0',
    `tx_hash`      varchar(128)        NOT NULL,
    `tx_index`     int(11)             NOT NULL,
    `log_index`    int(11)             NOT NULL,
    `event`        varchar(128)        NOT NULL,
    `args`         json                         DEFAULT NULL,
    `status`       tinyint(3) unsigned NOT NULL DEFAULT '1',
    `create_time`  datetime(3)         NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_time`  datetime(3)         NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    `comment`      varchar(512)        NOT NULL DEFAULT '',
    PRIMARY KEY (`id`),
    UNIQUE KEY `unique_chain_tx_hash_tx_index_log_index` (`chain`, `tx_hash`, `tx_index`, `log_index`),
    KEY `index_event_name` (`event`),
    KEY `index_event_block_number` (`block_number`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE `gas_price`
(
    `id`          bigint(20) unsigned NOT NULL AUTO_INCREMENT,
    `chain`       varchar(32)         NOT NULL,
    `fastest`     decimal(65, 30)     NOT NULL DEFAULT '0.000000000000000000000000000000',
    `fast`        decimal(65, 30)     NOT NULL DEFAULT '0.000000000000000000000000000000',
     `max_priority_fee` decimal(65, 30) NOT NULL DEFAULT '0.000000000000000000000000000000',
    `source`      varchar(128)        NOT NULL,
    `status`      tinyint(3) unsigned NOT NULL DEFAULT '1',
    `create_time` datetime(3)         NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_time` datetime(3)         NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    `comment`     varchar(512)        NOT NULL DEFAULT '',
    PRIMARY KEY (`id`),
    UNIQUE KEY `unique_chain_source` (`chain`, `source`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE `record`
(
    `id`                  bigint(20) unsigned NOT NULL AUTO_INCREMENT,
    `chain`               varchar(32)         NOT NULL,
    `event`               varchar(128)        NOT NULL,
    `steps`               int(10)             NOT NULL,
    `keeper_block_number` bigint(10)          NOT NULL,
    `latest_block_number` bigint(10)          NOT NULL,
    `status`              tinyint(3) unsigned NOT NULL DEFAULT '1',
    `create_time`         datetime(3)         NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_time`         datetime(3)         NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    `comment`             varchar(512)        NOT NULL DEFAULT '',
    PRIMARY KEY (`id`),
    UNIQUE KEY `unique_chain_event_status` (`chain`, `event`, `status`),
    KEY `index_chain_block_block_number` (`chain`, `keeper_block_number`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;