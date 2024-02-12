export enum NodeType {
    Variable = "variable",
    Modifier = "modifier",
    AdditionalSource = "additional-source",
    Campaign = "campaign",
    FeedExport = "feed-export",
    KeywordSetting = "keyword-setting",
    AdwordsSetting = "adwords-setting",
    BaseAdtext = "base-adtext",
    BidRule = "bid-rule",
    Default = "default",
}

export enum EntityType {
    DataSourceVariable = "DataSourceVariable",
    AdditionalSource = "AdditionalSource",
    CampaignSetting = "CampaignSetting",
    FeedExport = "FeedExport",
    KeywordSetting = "KeywordSetting",
    AdwordsSetting = "AdwordsSetting",
    BaseAdtext = "BaseAdtext",
    BidRule = "BidRule",
}

export enum VariableType {
    Number = "number",
    Text = "text",
    Date = "date",
    Array = "array",
    Image = "image",
}

export enum EntityCollectionName {
    Variables = "variables",
    FeedExports = "feedExports",
    AdditionalSources = "additionalSources",
    CampaignSettings = "campaignSettings",
}

export enum EntitySpecificProperty {
    BidRules = "bidRules",
    BaseAdtexts = "baseAdtexts",
    KeywordSettings = "keywordSettings",
    AdwordsSetting = "adwordsSetting",
    AdditionalSource = "additionalSource",
}