const { CatStatus, CatStatusSchema } = require('./catStatus.model');
const { Committee, CommitteeSchema } = require('./committees.model');
const { History, HistorySchema } = require('./history.model');
const { InstallationMinute, InstallationMinuteSchema } = require('./installationMinutes.model');
const { PDFFile, PDFFileSchema } = require('./pdfFiles.model');
const { ProcessedPDF, ProcessedPDFSchema } = require('./processedPDF.models');
const { Supporter, SupporterSchema } = require('./supporters.model');
const { SupporterFinal, SupporterFinalSchema } = require('./supportersFinal.model');
const { User, UserSchema } = require('./users.model');
const { UserCallCenter, UserCallCenterSchema } = require('./usersCallCenter.model');
const { CallCenter, CallCenterSchema } = require('./callCenter.model');
const { Call, CallSchema } = require('./call.model');

const { Received, ReceivedSchema } = require('./received.model');
const { Delivered, DeliveredSchema } = require('./delivered.model');
const { Dt, DtSchema } = require('./dt.model');
const { Section, SectionSchema } = require('./sections.model');

function setupModels(sequelize) {
    //Init models
    CatStatus.init(CatStatusSchema, CatStatus.config(sequelize));
    Committee.init(CommitteeSchema, Committee.config(sequelize));
    History.init(HistorySchema, History.config(sequelize));
    InstallationMinute.init(InstallationMinuteSchema, InstallationMinute.config(sequelize));
    PDFFile.init(PDFFileSchema, PDFFile.config(sequelize));
    ProcessedPDF.init(ProcessedPDFSchema, ProcessedPDF.config(sequelize));
    Supporter.init(SupporterSchema, Supporter.config(sequelize));
    SupporterFinal.init(SupporterFinalSchema, SupporterFinal.config(sequelize));
    User.init(UserSchema, User.config(sequelize));
    UserCallCenter.init(UserCallCenterSchema, UserCallCenter.config(sequelize));
    CallCenter.init(CallCenterSchema, CallCenter.config(sequelize));
    Call.init(CallSchema, Call.config(sequelize));

    Received.init(ReceivedSchema, Received.config(sequelize));
    Delivered.init(DeliveredSchema, Delivered.config(sequelize));
    Dt.init(DtSchema, Dt.config(sequelize));
    Section.init(SectionSchema, Section.config(sequelize))


    //Create relations


    ProcessedPDF.hasOne(PDFFile, { foreignKey: "id" });
    PDFFile.hasOne(ProcessedPDF, { foreignKey: 'idPDFFile' });

    CatStatus.hasOne(History, { foreignKey: "idStatus" });
    History.hasMany(CatStatus, { foreignKey: 'id' });

    CatStatus.hasOne(PDFFile, { foreignKey: "idStatus" });
    PDFFile.hasOne(CatStatus, { foreignKey: 'id' });

    History.hasOne(PDFFile, { foreignKey: "id" });
    PDFFile.hasMany(History, { foreignKey: 'idPDFFile' });

    Committee.hasOne(PDFFile, { foreignKey: "id" });
    PDFFile.hasOne(Committee, { foreignKey: 'idPDFFile' });

    InstallationMinute.hasOne(Committee, { foreignKey: 'id' });
    Committee.hasOne(InstallationMinute, { foreignKey: "idCommittee" });

    Committee.hasOne(Supporter, { foreignKey: "idCommittee" });
    Supporter.hasMany(Committee, { foreignKey: 'id' });


    CallCenter.hasMany(UserCallCenter, { foreignKey: 'id' });
    UserCallCenter.hasOne(CallCenter, { foreignKey: "idUser" });

    CallCenter.hasOne(SupporterFinal, { foreignKey: "id" });
    SupporterFinal.hasOne(CallCenter, { foreignKey: 'idSupporter' });
}

module.exports = setupModels;