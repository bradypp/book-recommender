import moment from 'moment';

export const formatDate = (date, format = 'MM/DD/YYYY') =>
  date ? moment(date).format(format) : date;

export const formatDateTime = (date, format = 'MM/DD/YYYY, h:mm A') =>
  date ? moment(date).format(format) : date;

export const formatDateTimeForAPI = date => {
  const formattedDate = moment(date).utc().format();
  return formattedDate !== 'Invalid date' ? formattedDate : date;
};

export const formatDateTimeConversational = date => (date ? moment(date).fromNow() : date);
