import { MongoClient } from "mongodb";
import MeetupList from "../components/meetups/MeetupList";
import Head from "next/head";
import { Fragment } from "react";

function HomePage(props) {
  return (
    <Fragment>
      <Head>
          <title>React Meetup</title>
          <meta name="description" content="A huge space for searching React meetups!"></meta>
      </Head>
      <MeetupList meetups={props.meetups} />
    </Fragment>
  );
}

// export async function getServerSideProps(context) {
//     //for updating after each incoming request
//     const req = context.req;
//     const res = context.res;

//     return {
//         props: {
//             meetups: DUMMY_DATA
//         }
//     }
// }

export async function getStaticProps() {
  //fetch data from an API or database. You always  have to return props!
  const client = await MongoClient.connect(
    "mongodb+srv://valeryiabeizer:pCV32dYi94mAS@cluster0.y2ttp.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find().toArray();
  client.close();

  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString(),
      })),
    },
    revalidate: 1, //amout of seconds after which the data will be re pre-rendered
  };
}

export default HomePage;
